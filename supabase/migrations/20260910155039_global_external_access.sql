CREATE SCHEMA IF NOT EXISTS private;

ALTER TABLE employees
  ADD COLUMN account_type TEXT NOT NULL DEFAULT 'internal'
  CHECK (account_type IN ('internal', 'external'));

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM clinic_memberships
    GROUP BY user_id
    HAVING bool_or(role = 'external') AND bool_or(role <> 'external')
  ) THEN
    RAISE EXCEPTION 'A user cannot have both external and internal clinic memberships';
  END IF;
END;
$$;

UPDATE employees employee
SET account_type = 'external'
WHERE EXISTS (
  SELECT 1
  FROM clinic_memberships membership
  WHERE membership.user_id = employee.id
    AND membership.role = 'external'
);

INSERT INTO employees (
  id,
  clinic_id,
  full_name,
  role,
  account_type
)
SELECT DISTINCT ON (membership.user_id)
  membership.user_id,
  membership.clinic_id,
  COALESCE(
    NULLIF(auth_user.raw_user_meta_data ->> 'full_name', ''),
    split_part(COALESCE(auth_user.email, 'Empleado'), '@', 1)
  ),
  CASE
    WHEN membership.role IN ('owner', 'admin') THEN 'admin'
    ELSE 'doctor'
  END,
  CASE WHEN membership.role = 'external' THEN 'external' ELSE 'internal' END
FROM clinic_memberships membership
JOIN auth.users auth_user ON auth_user.id = membership.user_id
LEFT JOIN employees employee ON employee.id = membership.user_id
WHERE employee.id IS NULL
ORDER BY membership.user_id, membership.joined_at NULLS LAST, membership.created_at;

ALTER TABLE clinic_memberships
  ADD CONSTRAINT clinic_memberships_employee_fkey
  FOREIGN KEY (user_id) REFERENCES employees(id) ON DELETE CASCADE;

ALTER TABLE appointments
  ADD CONSTRAINT appointments_employee_membership_fkey
  FOREIGN KEY (employee_id, clinic_id)
  REFERENCES clinic_memberships(user_id, clinic_id)
  ON DELETE RESTRICT;

DROP POLICY IF EXISTS employees_select_same_clinic ON employees;
DROP POLICY IF EXISTS employees_admin_insert ON employees;
DROP POLICY IF EXISTS employees_admin_update ON employees;
DROP POLICY IF EXISTS employees_self_update ON employees;

CREATE OR REPLACE FUNCTION current_employee_clinic_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT membership.clinic_id
  FROM public.clinic_memberships membership
  WHERE membership.user_id = (SELECT auth.uid())
    AND membership.status = 'active'
  ORDER BY membership.joined_at NULLS LAST, membership.created_at
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION current_employee_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT employee.role
  FROM public.employees employee
  WHERE employee.id = (SELECT auth.uid())
$$;

ALTER TABLE employees DROP COLUMN clinic_id;

CREATE OR REPLACE FUNCTION private.is_external_user()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT COALESCE((
    SELECT employee.account_type = 'external'
    FROM public.employees employee
    WHERE employee.id = (SELECT auth.uid())
  ), false)
$$;

CREATE OR REPLACE FUNCTION private.has_active_clinic_access(p_clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clinic_memberships membership
    WHERE membership.user_id = (SELECT auth.uid())
      AND membership.clinic_id = p_clinic_id
      AND membership.status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION private.is_clinic_owner(p_clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clinic_memberships membership
    WHERE membership.user_id = (SELECT auth.uid())
      AND membership.clinic_id = p_clinic_id
      AND membership.status = 'active'
      AND membership.role = 'owner'
  )
$$;

CREATE OR REPLACE FUNCTION private.shares_active_clinic(p_employee_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clinic_memberships viewer_membership
    JOIN public.clinic_memberships employee_membership
      ON employee_membership.clinic_id = viewer_membership.clinic_id
    WHERE viewer_membership.user_id = (SELECT auth.uid())
      AND viewer_membership.status = 'active'
      AND employee_membership.user_id = p_employee_id
      AND employee_membership.status = 'active'
  )
$$;

CREATE OR REPLACE FUNCTION private.can_update_employee(p_employee_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT
    p_employee_id = (SELECT auth.uid())
    OR EXISTS (
      SELECT 1
      FROM public.employees employee
      JOIN public.clinic_memberships employee_membership
        ON employee_membership.user_id = employee.id
      JOIN public.clinic_memberships owner_membership
        ON owner_membership.clinic_id = employee_membership.clinic_id
      WHERE employee.id = p_employee_id
        AND employee.account_type = 'internal'
        AND employee_membership.status = 'active'
        AND owner_membership.user_id = (SELECT auth.uid())
        AND owner_membership.status = 'active'
        AND owner_membership.role = 'owner'
    )
$$;

CREATE OR REPLACE FUNCTION private.can_view_clinic_membership(
  p_clinic_id UUID,
  p_user_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT
    p_user_id = (SELECT auth.uid())
    OR (
      NOT (SELECT private.is_external_user())
      AND (SELECT private.has_active_clinic_access(p_clinic_id))
    )
$$;

CREATE OR REPLACE FUNCTION private.can_manage_clinic(
  p_clinic_id UUID,
  p_roles TEXT[]
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(p_clinic_id))
    AND EXISTS (
      SELECT 1
      FROM public.employees employee
      WHERE employee.id = (SELECT auth.uid())
        AND employee.role = ANY(p_roles)
    )
$$;

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
  )
$$;

CREATE OR REPLACE FUNCTION private.can_access_patient_storage(p_storage_name TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
DECLARE
  path_clinic_id UUID;
  path_patient_id UUID;
BEGIN
  path_clinic_id := split_part(p_storage_name, '/', 1)::UUID;
  path_patient_id := split_part(p_storage_name, '/', 2)::UUID;

  RETURN EXISTS (
    SELECT 1
    FROM public.patients patient
    WHERE patient.id = path_patient_id
      AND patient.clinic_id = path_clinic_id
      AND (SELECT private.can_access_patient(path_patient_id))
  );
EXCEPTION WHEN invalid_text_representation THEN
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION private.enforce_global_account_type()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  employee_account_type TEXT;
BEGIN
  SELECT employee.account_type
  INTO employee_account_type
  FROM public.employees employee
  WHERE employee.id = NEW.user_id;

  IF employee_account_type = 'external' AND NEW.role <> 'external' THEN
    RAISE EXCEPTION 'External users must remain external in every clinic';
  END IF;

  IF employee_account_type = 'internal' AND NEW.role = 'external' THEN
    RAISE EXCEPTION 'Internal users cannot receive external memberships';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER clinic_memberships_global_account_type
  BEFORE INSERT OR UPDATE OF user_id, role ON clinic_memberships
  FOR EACH ROW EXECUTE FUNCTION private.enforce_global_account_type();

REVOKE ALL ON SCHEMA private FROM PUBLIC, anon;
GRANT USAGE ON SCHEMA private TO authenticated;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA private FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_external_user() TO authenticated;
GRANT EXECUTE ON FUNCTION private.has_active_clinic_access(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.is_clinic_owner(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.shares_active_clinic(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_update_employee(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_view_clinic_membership(UUID, UUID)
  TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_manage_clinic(UUID, TEXT[]) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_access_patient(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION private.can_access_patient_storage(TEXT) TO authenticated;

CREATE POLICY employees_select_accessible
  ON employees FOR SELECT TO authenticated
  USING (
    id = (SELECT auth.uid())
    OR (
      NOT (SELECT private.is_external_user())
      AND (SELECT private.shares_active_clinic(id))
    )
  );

CREATE POLICY employees_update_accessible
  ON employees FOR UPDATE TO authenticated
  USING ((SELECT private.can_update_employee(id)))
  WITH CHECK ((SELECT private.can_update_employee(id)));

DROP POLICY IF EXISTS clinic_memberships_select_own ON clinic_memberships;
CREATE POLICY clinic_memberships_select_accessible
  ON clinic_memberships FOR SELECT TO authenticated
  USING (
    (SELECT private.can_view_clinic_membership(clinic_id, user_id))
  );

REVOKE UPDATE ON employees FROM authenticated;
GRANT UPDATE (full_name, role, specialty, color, avatar_url, phone, active)
  ON employees TO authenticated;

CREATE OR REPLACE FUNCTION public.set_external_membership_status(
  p_employee_id UUID,
  p_clinic_id UUID,
  p_status TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF p_status NOT IN ('active', 'suspended') THEN
    RAISE EXCEPTION 'Invalid membership status';
  END IF;

  IF NOT (SELECT private.is_clinic_owner(p_clinic_id)) THEN
    RAISE EXCEPTION 'Only clinic owners can update external memberships';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.employees employee
    WHERE employee.id = p_employee_id
      AND employee.account_type = 'external'
  ) THEN
    RAISE EXCEPTION 'Only external memberships can be updated';
  END IF;

  UPDATE public.clinic_memberships
  SET status = p_status
  WHERE user_id = p_employee_id
    AND clinic_id = p_clinic_id
    AND role = 'external';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'External membership not found';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.set_external_membership_status(UUID, UUID, TEXT)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_external_membership_status(UUID, UUID, TEXT)
  TO authenticated;

DROP POLICY IF EXISTS clinics_select_same_clinic ON clinics;
CREATE POLICY clinics_select_memberships
  ON clinics FOR SELECT TO authenticated
  USING ((SELECT private.has_active_clinic_access(id)));

DROP POLICY IF EXISTS patients_select_same_clinic ON patients;
DROP POLICY IF EXISTS patients_write_allowed_roles ON patients;
CREATE POLICY patients_select_accessible
  ON patients FOR SELECT TO authenticated
  USING ((SELECT private.can_access_patient(id)));
CREATE POLICY patients_write_internal
  ON patients FOR ALL TO authenticated
  USING ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor'])))
  WITH CHECK ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor'])));

DROP POLICY IF EXISTS treatment_same_clinic ON treatment;
DROP POLICY IF EXISTS treatment_types_same_clinic ON treatment;
CREATE POLICY treatment_select_memberships
  ON treatment FOR SELECT TO authenticated
  USING ((SELECT private.has_active_clinic_access(clinic_id)));
CREATE POLICY treatment_write_internal
  ON treatment FOR ALL TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  )
  WITH CHECK (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  );

DROP POLICY IF EXISTS treatment_inventory_items_select_same_clinic
  ON treatment_inventory_items;
DROP POLICY IF EXISTS treatment_inventory_items_write_same_clinic
  ON treatment_inventory_items;
CREATE POLICY treatment_inventory_items_internal
  ON treatment_inventory_items FOR ALL TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND EXISTS (
      SELECT 1 FROM treatment
      WHERE treatment.id = treatment_inventory_items.treatment_id
        AND (SELECT private.has_active_clinic_access(treatment.clinic_id))
    )
  )
  WITH CHECK (
    NOT (SELECT private.is_external_user())
    AND EXISTS (
      SELECT 1 FROM treatment
      WHERE treatment.id = treatment_inventory_items.treatment_id
        AND (SELECT private.has_active_clinic_access(treatment.clinic_id))
    )
  );

DROP POLICY IF EXISTS inventory_items_select_same_clinic ON inventory_items;
DROP POLICY IF EXISTS inventory_items_write_allowed_roles ON inventory_items;
CREATE POLICY inventory_items_internal
  ON inventory_items FOR ALL TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  )
  WITH CHECK (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  );

DROP POLICY IF EXISTS inventory_movements_select_same_clinic ON inventory_movements;
DROP POLICY IF EXISTS inventory_movements_insert_allowed_roles ON inventory_movements;
CREATE POLICY inventory_movements_internal
  ON inventory_movements FOR ALL TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = inventory_movements.item_id
        AND (SELECT private.has_active_clinic_access(inventory_items.clinic_id))
    )
  )
  WITH CHECK (
    NOT (SELECT private.is_external_user())
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = inventory_movements.item_id
        AND (SELECT private.has_active_clinic_access(inventory_items.clinic_id))
    )
  );

DROP POLICY IF EXISTS patient_images_select_same_clinic ON patient_images;
DROP POLICY IF EXISTS patient_images_write_allowed_roles ON patient_images;
CREATE POLICY patient_images_select_accessible
  ON patient_images FOR SELECT TO authenticated
  USING ((SELECT private.can_access_patient(patient_id)));
CREATE POLICY patient_images_write_internal
  ON patient_images FOR ALL TO authenticated
  USING ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor'])))
  WITH CHECK (
    (SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor']))
    AND EXISTS (
      SELECT 1 FROM patients patient
      WHERE patient.id = patient_images.patient_id
        AND patient.clinic_id = patient_images.clinic_id
    )
  );

DROP POLICY IF EXISTS patient_files_select ON patient_files;
DROP POLICY IF EXISTS patient_files_insert ON patient_files;
DROP POLICY IF EXISTS patient_files_update ON patient_files;
DROP POLICY IF EXISTS patient_files_delete ON patient_files;
CREATE POLICY patient_files_select_accessible
  ON patient_files FOR SELECT TO authenticated
  USING ((SELECT private.can_access_patient(patient_id)));
CREATE POLICY patient_files_insert_internal
  ON patient_files FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor']))
    AND EXISTS (
      SELECT 1 FROM patients patient
      WHERE patient.id = patient_files.patient_id
        AND patient.clinic_id = patient_files.clinic_id
    )
  );
CREATE POLICY patient_files_update_internal
  ON patient_files FOR UPDATE TO authenticated
  USING ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor'])))
  WITH CHECK (
    (SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor']))
    AND EXISTS (
      SELECT 1 FROM patients patient
      WHERE patient.id = patient_files.patient_id
        AND patient.clinic_id = patient_files.clinic_id
    )
  );
CREATE POLICY patient_files_delete_internal
  ON patient_files FOR DELETE TO authenticated
  USING ((SELECT private.can_manage_clinic(clinic_id, ARRAY['admin','reception','doctor'])));

DROP POLICY IF EXISTS patient_images_storage_select ON storage.objects;
DROP POLICY IF EXISTS patient_images_storage_insert ON storage.objects;
DROP POLICY IF EXISTS patient_images_storage_delete ON storage.objects;
DROP POLICY IF EXISTS patient_files_storage_select ON storage.objects;
DROP POLICY IF EXISTS patient_files_storage_insert ON storage.objects;
DROP POLICY IF EXISTS patient_files_storage_delete ON storage.objects;
CREATE POLICY patient_clinical_storage_select
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id IN ('patient-images', 'patient-files')
    AND (SELECT private.can_access_patient_storage(name))
  );
CREATE POLICY patient_clinical_storage_insert
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id IN ('patient-images', 'patient-files')
    AND NOT (SELECT private.is_external_user())
    AND (SELECT private.can_access_patient_storage(name))
  );
CREATE POLICY patient_clinical_storage_update
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id IN ('patient-images', 'patient-files')
    AND NOT (SELECT private.is_external_user())
    AND (SELECT private.can_access_patient_storage(name))
  )
  WITH CHECK (
    bucket_id IN ('patient-images', 'patient-files')
    AND NOT (SELECT private.is_external_user())
    AND (SELECT private.can_access_patient_storage(name))
  );
CREATE POLICY patient_clinical_storage_delete
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id IN ('patient-images', 'patient-files')
    AND NOT (SELECT private.is_external_user())
    AND (SELECT private.can_access_patient_storage(name))
  );

CREATE TABLE treatment_prices (
  treatment_id UUID PRIMARY KEY REFERENCES treatment(id) ON DELETE CASCADE,
  price NUMERIC(10,2),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE appointment_treatment_prices (
  appointment_treatment_id UUID PRIMARY KEY REFERENCES appointment_treatments(id) ON DELETE CASCADE,
  price_at_booking NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO treatment_prices (treatment_id, price)
SELECT id, price FROM treatment;

INSERT INTO appointment_treatment_prices (appointment_treatment_id, price_at_booking)
SELECT id, price_at_booking FROM appointment_treatments;

ALTER TABLE treatment_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_treatment_prices ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON treatment_prices FROM anon, authenticated;
REVOKE ALL ON appointment_treatment_prices FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON treatment_prices TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON appointment_treatment_prices TO authenticated;
GRANT ALL ON treatment_prices TO service_role;
GRANT ALL ON appointment_treatment_prices TO service_role;

CREATE POLICY treatment_prices_internal
  ON treatment_prices FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM treatment
      WHERE treatment.id = treatment_prices.treatment_id
        AND NOT (SELECT private.is_external_user())
        AND (SELECT private.has_active_clinic_access(treatment.clinic_id))
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM treatment
      WHERE treatment.id = treatment_prices.treatment_id
        AND NOT (SELECT private.is_external_user())
        AND (SELECT private.has_active_clinic_access(treatment.clinic_id))
    )
  );

CREATE POLICY appointment_treatment_prices_internal
  ON appointment_treatment_prices FOR ALL TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND EXISTS (
      SELECT 1
      FROM appointment_treatments appointment_treatment
      JOIN appointments appointment
        ON appointment.id = appointment_treatment.appointment_id
      WHERE appointment_treatment.id = appointment_treatment_prices.appointment_treatment_id
        AND (SELECT private.has_active_clinic_access(appointment.clinic_id))
    )
  )
  WITH CHECK (
    NOT (SELECT private.is_external_user())
    AND EXISTS (
      SELECT 1
      FROM appointment_treatments appointment_treatment
      JOIN appointments appointment
        ON appointment.id = appointment_treatment.appointment_id
      WHERE appointment_treatment.id = appointment_treatment_prices.appointment_treatment_id
        AND (SELECT private.has_active_clinic_access(appointment.clinic_id))
    )
  );

ALTER TABLE treatment DROP COLUMN price;
ALTER TABLE appointment_treatments DROP COLUMN price_at_booking;
