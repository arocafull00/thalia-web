-- Confirmación de cita por el paciente desde un enlace público (issue #87)
--
-- El recordatorio de 24 h lleva un enlace con un token y el paciente confirma su
-- cita sin llamadas ni mensajes de por medio. Es **el mismo mensaje**, no uno
-- añadido: confirmar la víspera es cuando de verdad le sirve a la clínica, y no
-- duplica el coste de mensajería.
--
-- La página que abre ese enlace es pública: el navegador va como `anon`, sin
-- sesión y sin clínica activa.
--
-- Por eso toda la lógica vive en dos funciones SECURITY DEFINER y `anon` no
-- recibe acceso directo a ninguna tabla. Abrir una política de RLS que dejara a
-- `anon` actualizar `appointments` —aunque fuera condicionada al token— sería
-- una superficie mucho más ancha que dos funciones con una firma fija.

-- No hay plantilla propia: el texto es el del recordatorio, que gana la
-- variable {enlace}. Este interruptor sólo decide si ese enlace se genera y se
-- sustituye en el mensaje.
ALTER TABLE clinics
  ADD COLUMN IF NOT EXISTS whatsapp_confirmation_enabled BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS appointment_confirmation_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- UUID v4: 122 bits de entropía. No se adivina por fuerza bruta y no revela
  -- nada de la cita a la que apunta.
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Un único token por cita: reenviar el mensaje reutiliza el mismo enlace en
-- lugar de dejar varios vivos a la vez.
CREATE UNIQUE INDEX IF NOT EXISTS appointment_confirmation_tokens_appointment_idx
  ON appointment_confirmation_tokens (appointment_id);
CREATE INDEX IF NOT EXISTS appointment_confirmation_tokens_token_idx
  ON appointment_confirmation_tokens (token);
CREATE INDEX IF NOT EXISTS appointment_confirmation_tokens_clinic_idx
  ON appointment_confirmation_tokens (clinic_id);

ALTER TABLE appointment_confirmation_tokens ENABLE ROW LEVEL SECURITY;

-- Sólo lectura, y sólo para el equipo de la clínica: la app necesita saber si
-- se envió el enlace y si el paciente ya confirmó. `anon` no aparece aquí.
CREATE POLICY "clinic_members_can_read_confirmation_tokens"
  ON appointment_confirmation_tokens FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clinic_memberships
      WHERE clinic_memberships.clinic_id = appointment_confirmation_tokens.clinic_id
        AND clinic_memberships.user_id = auth.uid()
        AND clinic_memberships.status = 'active'
    )
  );

-- ---------------------------------------------------------------------------
-- Estado de la cita tal y como lo ve el paciente
-- ---------------------------------------------------------------------------
--
-- Se calcula en un solo sitio porque lo consultan la lectura y la escritura, y
-- porque el orden de los casos es la propia regla de negocio: una cita ya
-- confirmada se anuncia como confirmada aunque el token haya caducado.

CREATE OR REPLACE FUNCTION appointment_confirmation_state(
  p_status TEXT,
  p_starts_at TIMESTAMPTZ,
  p_expires_at TIMESTAMPTZ,
  p_confirmed_at TIMESTAMPTZ
)
RETURNS TEXT
LANGUAGE SQL
-- STABLE y no IMMUTABLE: el cuerpo llama a now(). Declararla inmutable dejaría
-- al planificador plegarla a constante y una cita podría quedarse marcada como
-- futura para siempre.
STABLE
AS $$
  SELECT CASE
    WHEN p_confirmed_at IS NOT NULL OR p_status = 'confirmed' THEN 'already_confirmed'
    WHEN p_status = 'cancelled' THEN 'cancelled'
    WHEN p_status IN ('in_progress', 'completed', 'no_show') THEN 'closed'
    WHEN p_starts_at < now() THEN 'past'
    WHEN p_expires_at < now() THEN 'expired'
    WHEN p_status = 'scheduled' THEN 'confirmable'
    ELSE 'closed'
  END;
$$;

-- ---------------------------------------------------------------------------
-- Lectura: qué ve quien abre el enlace
-- ---------------------------------------------------------------------------
--
-- Devuelve el mínimo imprescindible. El enlace viaja por WhatsApp, se reenvía y
-- se queda en el historial del móvil, así que aquí no salen apellidos,
-- teléfono, DNI, tratamiento ni ninguna otra cita del paciente: sólo el nombre
-- de pila, para que reconozca que la cita es suya.
--
-- Un token inexistente devuelve cero filas, sin distinguir entre "nunca existió"
-- y "ya no vale".

CREATE OR REPLACE FUNCTION get_appointment_confirmation(p_token UUID)
RETURNS TABLE (
  state TEXT,
  patient_first_name TEXT,
  clinic_name TEXT,
  clinic_phone TEXT,
  clinic_timezone TEXT,
  employee_first_name TEXT,
  starts_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    appointment_confirmation_state(a.status, a.starts_at, t.expires_at, t.confirmed_at),
    split_part(p.full_name, ' ', 1),
    c.name,
    c.phone,
    c.timezone,
    split_part(e.full_name, ' ', 1),
    a.starts_at
  FROM appointment_confirmation_tokens t
  JOIN appointments a ON a.id = t.appointment_id
  JOIN clinics c ON c.id = a.clinic_id
  JOIN patients p ON p.id = a.patient_id
  JOIN employees e ON e.id = a.employee_id
  WHERE t.token = p_token;
$$;

-- ---------------------------------------------------------------------------
-- Escritura: el botón «Confirmar»
-- ---------------------------------------------------------------------------
--
-- Idempotente a propósito. El paciente puede pulsar dos veces, volver al enlace
-- días después o tener el mensaje abierto en dos móviles: en todos esos casos
-- responde el estado actual sin error y sin volver a escribir.
--
-- Esto NO se ejecuta al abrir la página. WhatsApp y Twilio precargan los
-- enlaces para generar la vista previa del mensaje, así que si la confirmación
-- ocurriera en el GET las citas se confirmarían solas al entregarse el mensaje.
-- La lectura es `get_appointment_confirmation`; esta función sólo la invoca el
-- botón.

CREATE OR REPLACE FUNCTION confirm_appointment_by_token(p_token UUID)
RETURNS TABLE (
  state TEXT,
  patient_first_name TEXT,
  clinic_name TEXT,
  clinic_phone TEXT,
  clinic_timezone TEXT,
  employee_first_name TEXT,
  starts_at TIMESTAMPTZ
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token appointment_confirmation_tokens%ROWTYPE;
  v_appointment appointments%ROWTYPE;
  v_state TEXT;
BEGIN
  -- FOR UPDATE serializa dos pulsaciones simultáneas del mismo enlace.
  SELECT * INTO v_token
  FROM appointment_confirmation_tokens
  WHERE token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  SELECT * INTO v_appointment
  FROM appointments
  WHERE id = v_token.appointment_id
  FOR UPDATE;

  v_state := appointment_confirmation_state(
    v_appointment.status, v_appointment.starts_at,
    v_token.expires_at, v_token.confirmed_at
  );

  IF v_state = 'confirmable' THEN
    UPDATE appointments
      SET status = 'confirmed', updated_at = now()
      WHERE id = v_appointment.id;

    UPDATE appointment_confirmation_tokens
      SET confirmed_at = now()
      WHERE id = v_token.id;
  END IF;

  RETURN QUERY SELECT * FROM get_appointment_confirmation(p_token);
END;
$$;

-- `anon` puede ejecutar las dos funciones y nada más: no tiene ninguna política
-- sobre appointments, patients, employees ni sobre la tabla de tokens.
REVOKE ALL ON FUNCTION get_appointment_confirmation(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION confirm_appointment_by_token(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_appointment_confirmation(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION confirm_appointment_by_token(UUID) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Registro del envío
-- ---------------------------------------------------------------------------
--
-- El envío sigue siendo el del recordatorio, así que `appointment_reminders` no
-- cambia de forma ni de deduplicación: un aviso por cita y ventana.
--
-- Contador de consumo por clínica y periodo (#84).
CREATE INDEX IF NOT EXISTS appointment_reminders_clinic_sent_at_idx
  ON appointment_reminders (clinic_id, sent_at);
