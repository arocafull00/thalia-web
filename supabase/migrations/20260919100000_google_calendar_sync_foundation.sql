/*
 * Cimientos de la sincronización con Google Calendar (#96).
 *
 * Esta migración solo monta el almacenamiento y la captura de cambios. Todavía
 * no habla con Google: eso llega cuando exista el cliente OAuth y el worker.
 */

CREATE TYPE public.google_calendar_connection_status AS ENUM (
  'active',
  'needs_reauth'
);

CREATE TYPE public.calendar_sync_operation AS ENUM ('upsert', 'delete');

-- ---------------------------------------------------------------------------
-- Conexión, una por profesional
-- ---------------------------------------------------------------------------
/*
 * La conexión es de cada empleado y no de la clínica. La cita lleva
 * `employee_id`, y quien quiere su agenda en el móvil es el profesional; una
 * cuenta de clínica obligaría a decidir de quién es la cuenta, y el día que esa
 * persona se marcha la clínica pierde el calendario.
 *
 * Google empuja en la misma dirección: el dueño de un calendario secundario es
 * la cuenta que lo crea, y desaconseja crearlos con cuenta de servicio.
 */
CREATE TABLE public.google_calendar_connections (
  employee_id UUID PRIMARY KEY
    REFERENCES public.employees(id) ON DELETE CASCADE,
  google_email TEXT NOT NULL,
  -- El calendario secundario «Thalia», que se crea al conectar.
  calendar_id TEXT,
  -- Puntero al secreto en Vault. El refresh token nunca se guarda aquí.
  refresh_token_secret_id UUID,
  granted_scopes TEXT[] NOT NULL DEFAULT '{}',
  status public.google_calendar_connection_status NOT NULL DEFAULT 'active',
  last_sync_at TIMESTAMPTZ,
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER google_calendar_connections_updated_at
  BEFORE UPDATE ON public.google_calendar_connections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.google_calendar_connections ENABLE ROW LEVEL SECURITY;

/*
 * Permisos por columna, como en `clinic_billing`: la pantalla de Ajustes
 * necesita saber si hay conexión y con qué cuenta, y nada más. Ni
 * `refresh_token_secret_id` ni `last_error` salen al navegador — el primero
 * porque es la llave, el segundo porque puede arrastrar detalle interno de la
 * respuesta de Google.
 */
REVOKE ALL ON TABLE public.google_calendar_connections
  FROM PUBLIC, anon, authenticated;
GRANT SELECT (
  employee_id,
  google_email,
  calendar_id,
  status,
  last_sync_at,
  created_at,
  updated_at
) ON public.google_calendar_connections TO authenticated;
GRANT ALL ON TABLE public.google_calendar_connections TO service_role;

/*
 * Solo lectura, y solo de la propia. Conectar y desconectar pasa por el Route
 * Handler con `service_role`, que es quien custodia los tokens: si el navegador
 * pudiera escribir aquí podría dejar una conexión apuntando a otra cuenta.
 */
CREATE POLICY google_calendar_connections_select_own
  ON public.google_calendar_connections FOR SELECT TO authenticated
  USING (employee_id = (SELECT auth.uid()));

-- ---------------------------------------------------------------------------
-- Qué evento de Google corresponde a cada cita
-- ---------------------------------------------------------------------------
/*
 * Tabla puente, y no una columna `google_event_id` sobre `appointments` como
 * sugiere la tarea 3 de la issue: si una cita se reasigna de un profesional a
 * otro hay que borrar el evento del calendario del primero y crearlo en el del
 * segundo, y una sola columna no puede expresar en qué calendario vive cada
 * evento.
 */
CREATE TABLE private.appointment_calendar_events (
  appointment_id UUID NOT NULL
    REFERENCES public.appointments(id) ON DELETE CASCADE,
  employee_id UUID NOT NULL
    REFERENCES public.google_calendar_connections(employee_id) ON DELETE CASCADE,
  google_event_id TEXT NOT NULL,
  synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (appointment_id, employee_id)
);

ALTER TABLE private.appointment_calendar_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE private.appointment_calendar_events
  FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE private.appointment_calendar_events TO service_role;

-- ---------------------------------------------------------------------------
-- Cola de cambios pendientes de llevar a Google
-- ---------------------------------------------------------------------------
/*
 * Por qué una cola en la base y no una llamada desde el DAL:
 *
 * 1. Hay escrituras sobre `appointments` que no pasan por la aplicación. La
 *    confirmación del paciente por WhatsApp (`confirm_appointment_by_token`) y
 *    la aceptación del autónomo son UPDATE hechos dentro de la base. Un
 *    enganche en el código se los perdería y el calendario se desincronizaría
 *    en silencio, que es el peor fallo posible aquí.
 *
 * 2. Si Google está caído, dar una cita tiene que seguir funcionando. La
 *    sincronización es eventual; nadie puede quedarse sin poder atender porque
 *    falle una integración.
 */
CREATE TABLE private.calendar_sync_outbox (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  /*
   * Sin clave foránea a propósito. Al borrar una cita hay que borrar también su
   * evento en Google, y con `ON DELETE CASCADE` esta fila desaparecería antes
   * de que el worker llegara a hacerlo. `payload` lleva lo necesario para
   * actuar sin la cita delante.
   */
  appointment_id UUID NOT NULL,
  employee_id UUID NOT NULL,
  operation public.calendar_sync_operation NOT NULL,
  payload JSONB NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX calendar_sync_outbox_pending
  ON private.calendar_sync_outbox (next_attempt_at, id);

ALTER TABLE private.calendar_sync_outbox ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE private.calendar_sync_outbox
  FROM PUBLIC, anon, authenticated;
GRANT ALL ON TABLE private.calendar_sync_outbox TO service_role;

-- ---------------------------------------------------------------------------
-- Captura de cambios
-- ---------------------------------------------------------------------------
/*
 * Encola solo lo que Google llega a ver. Cambiar las notas de una cita no toca
 * el calendario, así que no genera trabajo.
 *
 * Y encola solo si hay a dónde sincronizar: sin conexión activa del profesional
 * —que hoy es el caso de todos— la cola se queda vacía en lugar de llenarse de
 * filas que nadie va a consumir.
 */
CREATE OR REPLACE FUNCTION private.enqueue_calendar_sync()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_payload JSONB;
BEGIN
  IF TG_OP = 'DELETE' THEN
    /*
     * Al borrar basta con que exista el evento: la conexión puede estar en
     * `needs_reauth` y el evento seguir colgado en el calendario del
     * profesional. Se encola igual y el worker lo intentará cuando reconecte.
     */
    INSERT INTO private.calendar_sync_outbox (
      appointment_id, employee_id, operation, payload
    )
    SELECT
      OLD.id,
      mapping.employee_id,
      'delete',
      jsonb_build_object('google_event_id', mapping.google_event_id)
    FROM private.appointment_calendar_events AS mapping
    WHERE mapping.appointment_id = OLD.id;

    RETURN OLD;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.starts_at IS NOT DISTINCT FROM OLD.starts_at
      AND NEW.ends_at IS NOT DISTINCT FROM OLD.ends_at
      AND NEW.status IS NOT DISTINCT FROM OLD.status
      AND NEW.employee_id IS NOT DISTINCT FROM OLD.employee_id
    THEN
      RETURN NEW;
    END IF;

    /*
     * Reasignada a otro profesional: el evento del anterior deja de tener
     * sentido y hay que retirarlo de su calendario.
     */
    IF NEW.employee_id IS DISTINCT FROM OLD.employee_id THEN
      INSERT INTO private.calendar_sync_outbox (
        appointment_id, employee_id, operation, payload
      )
      SELECT
        OLD.id,
        mapping.employee_id,
        'delete',
        jsonb_build_object('google_event_id', mapping.google_event_id)
      FROM private.appointment_calendar_events AS mapping
      WHERE mapping.appointment_id = OLD.id
        AND mapping.employee_id = OLD.employee_id;
    END IF;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.google_calendar_connections AS connection
    WHERE connection.employee_id = NEW.employee_id
      AND connection.status = 'active'
  ) THEN
    RETURN NEW;
  END IF;

  /*
   * El estado viaja en el payload y es el worker quien decide qué hacer con él
   * —una cita cancelada se retira del calendario—. El trigger no opina: así la
   * regla vive en un solo sitio y se puede probar sin base de datos.
   */
  v_payload := jsonb_build_object(
    'clinic_id', NEW.clinic_id,
    'starts_at', NEW.starts_at,
    'ends_at', NEW.ends_at,
    'status', NEW.status
  );

  INSERT INTO private.calendar_sync_outbox (
    appointment_id, employee_id, operation, payload
  )
  VALUES (NEW.id, NEW.employee_id, 'upsert', v_payload);

  RETURN NEW;
END;
$$;

CREATE TRIGGER appointments_enqueue_calendar_sync
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION private.enqueue_calendar_sync();

/*
 * El borrado se captura ANTES, y no después como el resto.
 *
 * `appointment_calendar_events` referencia la cita con ON DELETE CASCADE, así
 * que para cuando corre un trigger AFTER la correspondencia ya no existe y con
 * ella se ha ido el `google_event_id`. El evento se quedaría colgado en el
 * calendario del profesional para siempre, sin rastro de que estuvo ahí.
 */
CREATE TRIGGER appointments_enqueue_calendar_delete
  BEFORE DELETE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION private.enqueue_calendar_sync();
