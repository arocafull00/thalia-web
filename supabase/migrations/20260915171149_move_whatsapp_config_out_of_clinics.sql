CREATE TABLE public.whatsapp_config (
  clinic_id UUID PRIMARY KEY REFERENCES public.clinics(id) ON DELETE CASCADE,
  reminder_enabled BOOLEAN NOT NULL DEFAULT false,
  reminder_hours INTEGER[] NOT NULL DEFAULT '{24}',
  phone_number_id TEXT,
  message_template TEXT NOT NULL DEFAULT 'Hola {paciente}, te recordamos tu cita en {clinica} el {fecha} a las {hora} con {profesional}.',
  confirmation_enabled BOOLEAN NOT NULL DEFAULT false
);

ALTER TABLE public.whatsapp_config ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.whatsapp_config FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE public.whatsapp_config TO authenticated;
GRANT ALL ON TABLE public.whatsapp_config TO service_role;

CREATE POLICY whatsapp_config_select_managers
  ON public.whatsapp_config
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = whatsapp_config.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  );

CREATE POLICY whatsapp_config_insert_managers
  ON public.whatsapp_config
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = whatsapp_config.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  );

CREATE POLICY whatsapp_config_update_managers
  ON public.whatsapp_config
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = whatsapp_config.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = whatsapp_config.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  );

CREATE FUNCTION private.create_default_whatsapp_config()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.whatsapp_config (clinic_id)
  VALUES (NEW.id)
  ON CONFLICT (clinic_id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.create_default_whatsapp_config() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER clinics_create_default_whatsapp_config
  AFTER INSERT ON public.clinics
  FOR EACH ROW
  EXECUTE FUNCTION private.create_default_whatsapp_config();

INSERT INTO public.whatsapp_config (
  clinic_id,
  reminder_enabled,
  reminder_hours,
  phone_number_id,
  message_template,
  confirmation_enabled
)
SELECT
  id,
  whatsapp_reminder_enabled,
  whatsapp_reminder_hours,
  whatsapp_phone_number_id,
  whatsapp_message_template,
  whatsapp_confirmation_enabled
FROM public.clinics;

ALTER TABLE public.clinics
  DROP COLUMN whatsapp_reminder_enabled,
  DROP COLUMN whatsapp_reminder_hours,
  DROP COLUMN whatsapp_phone_number_id,
  DROP COLUMN whatsapp_message_template,
  DROP COLUMN whatsapp_confirmation_enabled;
