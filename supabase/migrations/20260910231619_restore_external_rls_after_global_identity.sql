CREATE OR REPLACE FUNCTION private.can_access_patient(p_patient_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.patients patient
    WHERE patient.id = p_patient_id
      AND (SELECT private.has_active_clinic_access(patient.clinic_id))
      AND (
        NOT (SELECT private.is_external_user())
        OR EXISTS (
          SELECT 1
          FROM public.appointments appointment
          WHERE appointment.patient_id = patient.id
            AND appointment.clinic_id = patient.clinic_id
            AND appointment.employee_id = (SELECT auth.uid())
        )
      )
  )
$$;

DROP POLICY IF EXISTS patients_select_same_clinic ON patients;
DROP POLICY IF EXISTS patients_select_accessible ON patients;
DROP POLICY IF EXISTS patients_write_allowed_roles ON patients;
DROP POLICY IF EXISTS patients_write_internal ON patients;

CREATE POLICY patients_select_accessible
  ON patients FOR SELECT TO authenticated
  USING ((SELECT private.can_access_patient(id)));

CREATE POLICY patients_write_internal
  ON patients FOR ALL TO authenticated
  USING (
    (SELECT private.can_manage_clinic(
      clinic_id,
      ARRAY['admin', 'reception', 'doctor']
    ))
  )
  WITH CHECK (
    (SELECT private.can_manage_clinic(
      clinic_id,
      ARRAY['admin', 'reception', 'doctor']
    ))
  );
