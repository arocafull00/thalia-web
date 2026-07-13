CREATE TABLE patient_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  storage_key TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  category TEXT NOT NULL CHECK (
    category IN (
      'consentimiento',
      'historia_clinica',
      'receta',
      'analitica',
      'informe',
      'otro'
    )
  ),
  notes TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX patient_files_patient_id_idx ON patient_files (patient_id);
CREATE INDEX patient_files_clinic_id_idx ON patient_files (clinic_id);
CREATE INDEX patient_files_category_idx ON patient_files (category);

CREATE TRIGGER patient_files_updated_at BEFORE UPDATE ON patient_files
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE patient_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY patient_files_select ON patient_files
  FOR SELECT USING (clinic_id = current_employee_clinic_id());

CREATE POLICY patient_files_insert ON patient_files
  FOR INSERT WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
    AND EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_id AND p.clinic_id = patient_files.clinic_id
    )
  );

CREATE POLICY patient_files_update ON patient_files
  FOR UPDATE USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
    AND EXISTS (
      SELECT 1 FROM patients p
      WHERE p.id = patient_id AND p.clinic_id = patient_files.clinic_id
    )
  );

CREATE POLICY patient_files_delete ON patient_files
  FOR DELETE USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
  );

INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-files', 'patient-files', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY patient_files_storage_select ON storage.objects
  FOR SELECT USING (
    bucket_id = 'patient-files'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
  );

CREATE POLICY patient_files_storage_insert ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'patient-files'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
  );

CREATE POLICY patient_files_storage_delete ON storage.objects
  FOR DELETE USING (
    bucket_id = 'patient-files'
    AND (storage.foldername(name))[1]::uuid = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
  );
