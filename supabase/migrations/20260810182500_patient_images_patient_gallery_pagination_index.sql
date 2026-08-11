CREATE INDEX idx_patient_images_clinic_patient_captured
  ON public.patient_images (
    clinic_id,
    patient_id,
    captured_at DESC NULLS LAST,
    created_at DESC NULLS LAST,
    id DESC
  );
