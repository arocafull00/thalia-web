CREATE TABLE patient_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  storage_key TEXT NOT NULL,
  original_filename TEXT,
  mime_type TEXT,
  file_size_bytes BIGINT,
  width INT,
  height INT,
  category TEXT,
  phase TEXT CHECK (phase IS NULL OR phase IN ('antes', 'durante', 'despues')),
  treatment_id UUID REFERENCES treatment(id) ON DELETE SET NULL,
  notes TEXT,
  captured_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_patient_images_patient_id ON patient_images (patient_id);
CREATE INDEX idx_patient_images_clinic_id ON patient_images (clinic_id);
CREATE INDEX idx_patient_images_captured_at ON patient_images (captured_at);

ALTER TABLE patient_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY patient_images_select_same_clinic ON patient_images
  FOR SELECT USING (clinic_id = current_employee_clinic_id());

CREATE POLICY patient_images_write_allowed_roles ON patient_images
  FOR ALL USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-images', 'patient-images', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY patient_images_storage_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'patient-images'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
  );

CREATE POLICY patient_images_storage_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'patient-images'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
  );

CREATE POLICY patient_images_storage_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'patient-images'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
  );

CREATE POLICY avatars_storage_select ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY avatars_storage_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY avatars_storage_update ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  )
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );

CREATE POLICY avatars_storage_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars'
    AND auth.uid() IS NOT NULL
  );
