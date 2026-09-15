CREATE OR REPLACE FUNCTION private.initialize_clinic_billing()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.clinic_billing (clinic_id)
  VALUES (NEW.id)
  ON CONFLICT (clinic_id) DO NOTHING;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.initialize_clinic_billing()
  FROM PUBLIC, anon, authenticated;

CREATE TRIGGER initialize_clinic_billing
  AFTER INSERT ON public.clinics
  FOR EACH ROW EXECUTE FUNCTION private.initialize_clinic_billing();

INSERT INTO public.clinic_billing (clinic_id)
SELECT clinic.id
FROM public.clinics clinic
ON CONFLICT (clinic_id) DO NOTHING;
