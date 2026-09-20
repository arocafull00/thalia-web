/*
 * Añade el nombre de la clínica al lote de sincronización (#96).
 *
 * El título «Cita» a secas no distingue nada en un calendario, y un profesional
 * que pasa consulta en dos sitios recibe las citas de ambos en el mismo
 * calendario: sin el nombre no sabe a cuál ir.
 *
 * El nombre de la clínica no identifica a ningún paciente ni dice nada de su
 * salud, así que no cruza la regla de privacidad: a Google sigue viajando el
 * cuándo y el dónde, nunca el quién ni el qué.
 *
 * Hay que borrar y recrear en lugar de usar CREATE OR REPLACE: cambiar las
 * columnas de un RETURNS TABLE no se puede reemplazar en caliente.
 */
DROP FUNCTION IF EXISTS public.claim_calendar_sync_batch(INTEGER, INTEGER);

CREATE FUNCTION public.claim_calendar_sync_batch(
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
  google_event_id TEXT,
  clinic_name TEXT
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
    mapping.google_event_id,
    clinic.name
  FROM bumped
  LEFT JOIN public.google_calendar_connections AS connection
    ON connection.employee_id = bumped.employee_id
  LEFT JOIN private.appointment_calendar_events AS mapping
    ON mapping.appointment_id = bumped.appointment_id
   AND mapping.employee_id = bumped.employee_id
  /*
   * El payload de un borrado no lleva `clinic_id` —solo el id del evento—, así
   * que el cast va con NULLIF: sin él, un texto vacío revienta la conversión a
   * UUID y tumbaría el lote entero por una fila que ni siquiera necesita el
   * nombre.
   */
  LEFT JOIN public.clinics AS clinic
    ON clinic.id = NULLIF(bumped.payload->>'clinic_id', '')::UUID
  ORDER BY bumped.id;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_calendar_sync_batch(INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_calendar_sync_batch(INTEGER, INTEGER)
  TO service_role;
