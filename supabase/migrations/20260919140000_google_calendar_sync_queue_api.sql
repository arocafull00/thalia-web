/*
 * API mínima para el worker de sincronización (#96).
 *
 * La cola y la tabla de correspondencias viven en `private`, que PostgREST no
 * expone, así que el worker no puede leerlas directamente. En lugar de sacarlas
 * a `public` —y tener que confiar en los permisos para que nadie las toque— se
 * le dan tres funciones y nada más. El esquema sigue cerrado y la superficie
 * alcanzable desde la API es exactamente la que necesita.
 *
 * Las tres están concedidas solo a `service_role`.
 */

/*
 * Toma un lote y lo marca como en curso en la misma operación.
 *
 * `FOR UPDATE SKIP LOCKED` es lo que permite que dos pasadas solapadas no se
 * pisen: la segunda salta las filas que la primera ya tiene cogidas en lugar de
 * esperar o duplicar el trabajo. Y el reintento se programa *antes* de intentar
 * nada, para que una fila que haga caer el worker a mitad no vuelva de
 * inmediato y lo tumbe otra vez en bucle.
 */
CREATE OR REPLACE FUNCTION public.claim_calendar_sync_batch(
  p_limit INTEGER DEFAULT 50,
  p_max_attempts INTEGER DEFAULT 8
)
RETURNS TABLE (
  id BIGINT,
  appointment_id UUID,
  employee_id UUID,
  operation public.calendar_sync_operation,
  payload JSONB,
  attempts INTEGER,
  calendar_id TEXT,
  connection_status public.google_calendar_connection_status,
  google_event_id TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN QUERY
  WITH claimed AS (
    SELECT outbox.id
    FROM private.calendar_sync_outbox AS outbox
    WHERE outbox.next_attempt_at <= now()
      AND outbox.attempts < p_max_attempts
    ORDER BY outbox.id
    LIMIT p_limit
    FOR UPDATE SKIP LOCKED
  ),
  bumped AS (
    UPDATE private.calendar_sync_outbox AS outbox
    SET
      attempts = outbox.attempts + 1,
      /*
       * Espera creciente: 1, 2, 4… minutos hasta una hora. Si Google está
       * caído, insistir cada minuto no arregla nada y gasta cuota.
       */
      next_attempt_at = now() + LEAST(
        INTERVAL '1 hour',
        (INTERVAL '1 minute') * POWER(2, outbox.attempts)
      )
    FROM claimed
    WHERE outbox.id = claimed.id
    RETURNING
      outbox.id,
      outbox.appointment_id,
      outbox.employee_id,
      outbox.operation,
      outbox.payload,
      outbox.attempts
  )
  SELECT
    bumped.id,
    bumped.appointment_id,
    bumped.employee_id,
    bumped.operation,
    bumped.payload,
    bumped.attempts,
    connection.calendar_id,
    connection.status,
    mapping.google_event_id
  FROM bumped
  LEFT JOIN public.google_calendar_connections AS connection
    ON connection.employee_id = bumped.employee_id
  LEFT JOIN private.appointment_calendar_events AS mapping
    ON mapping.appointment_id = bumped.appointment_id
   AND mapping.employee_id = bumped.employee_id
  ORDER BY bumped.id;
END;
$$;

/*
 * Cierra una fila y deja la correspondencia al día en la misma transacción: sin
 * eso podríamos borrar el trabajo pendiente y perder el `google_event_id` justo
 * después, quedándonos con un evento en Google que ya no sabemos identificar.
 */
CREATE OR REPLACE FUNCTION public.complete_calendar_sync(
  p_id BIGINT,
  p_google_event_id TEXT DEFAULT NULL,
  /*
   * Una cita cancelada llega como `upsert` —el trigger no interpreta estados—
   * pero su evento hay que retirarlo. El worker lo dice aquí en lugar de
   * duplicar la regla en SQL: así «qué estados liberan el hueco» vive en un
   * único sitio y se puede probar sin base de datos.
   */
  p_removed BOOLEAN DEFAULT false
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_appointment_id UUID;
  v_employee_id UUID;
  v_operation public.calendar_sync_operation;
BEGIN
  DELETE FROM private.calendar_sync_outbox
  WHERE id = p_id
  RETURNING appointment_id, employee_id, operation
  INTO v_appointment_id, v_employee_id, v_operation;

  IF v_appointment_id IS NULL THEN
    RETURN;
  END IF;

  IF v_operation = 'delete' OR p_removed THEN
    DELETE FROM private.appointment_calendar_events
    WHERE appointment_id = v_appointment_id
      AND employee_id = v_employee_id;

    RETURN;
  END IF;

  IF p_google_event_id IS NULL THEN
    RETURN;
  END IF;

  INSERT INTO private.appointment_calendar_events (
    appointment_id, employee_id, google_event_id, synced_at
  )
  VALUES (v_appointment_id, v_employee_id, p_google_event_id, now())
  ON CONFLICT (appointment_id, employee_id) DO UPDATE SET
    google_event_id = EXCLUDED.google_event_id,
    synced_at = now();

  UPDATE public.google_calendar_connections
  SET last_sync_at = now(), last_error = NULL
  WHERE employee_id = v_employee_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.fail_calendar_sync(
  p_id BIGINT,
  p_error TEXT
)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE private.calendar_sync_outbox
  SET last_error = left(p_error, 500)
  WHERE id = p_id;
$$;

/*
 * Cuando Google deja de aceptar el refresh token —el usuario revocó el permiso
 * desde su cuenta, o cambió la contraseña— no sirve de nada reintentar. Se
 * marca la conexión y Ajustes pasa a pedir que se vuelva a conectar.
 */
CREATE OR REPLACE FUNCTION public.mark_google_calendar_needs_reauth(
  p_employee_id UUID,
  p_error TEXT
)
RETURNS VOID
LANGUAGE sql
SECURITY DEFINER
SET search_path = ''
AS $$
  UPDATE public.google_calendar_connections
  SET status = 'needs_reauth', last_error = left(p_error, 500)
  WHERE employee_id = p_employee_id;
$$;

REVOKE ALL ON FUNCTION public.claim_calendar_sync_batch(INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.complete_calendar_sync(BIGINT, TEXT, BOOLEAN)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.fail_calendar_sync(BIGINT, TEXT)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.mark_google_calendar_needs_reauth(UUID, TEXT)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.claim_calendar_sync_batch(INTEGER, INTEGER)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.complete_calendar_sync(BIGINT, TEXT, BOOLEAN)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.fail_calendar_sync(BIGINT, TEXT)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.mark_google_calendar_needs_reauth(UUID, TEXT)
  TO service_role;
