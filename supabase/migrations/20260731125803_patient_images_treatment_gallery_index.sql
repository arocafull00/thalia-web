CREATE INDEX idx_patient_images_clinic_treatment_captured
  ON public.patient_images (
    clinic_id,
    treatment_id,
    captured_at DESC NULLS LAST,
    created_at DESC NULLS LAST,
    id DESC
  )
  WHERE treatment_id IS NOT NULL;
