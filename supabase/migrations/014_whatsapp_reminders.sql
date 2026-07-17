ALTER TABLE clinics
  ADD COLUMN IF NOT EXISTS whatsapp_reminder_enabled BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_reminder_hours INT[] NOT NULL DEFAULT '{24}',
  ADD COLUMN IF NOT EXISTS whatsapp_phone_number_id TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_message_template TEXT NOT NULL DEFAULT 'Hola {paciente}, te recordamos tu cita en {clinica} el {fecha} a las {hora} con {profesional}.';

CREATE TABLE IF NOT EXISTS appointment_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  patient_phone TEXT NOT NULL,
  hours_before INT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message TEXT,
  reminder_type TEXT NOT NULL DEFAULT 'whatsapp',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS appointment_reminders_appointment_id_idx ON appointment_reminders(appointment_id);
CREATE INDEX IF NOT EXISTS appointment_reminders_clinic_id_idx ON appointment_reminders(clinic_id);
CREATE UNIQUE INDEX IF NOT EXISTS appointment_reminders_dedup_idx
  ON appointment_reminders(appointment_id, hours_before, reminder_type)
  WHERE status = 'sent';

ALTER TABLE appointment_reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic_members_can_read_reminders"
  ON appointment_reminders FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM clinic_memberships
      WHERE clinic_memberships.clinic_id = appointment_reminders.clinic_id
        AND clinic_memberships.user_id = auth.uid()
        AND clinic_memberships.status = 'active'
    )
  );
