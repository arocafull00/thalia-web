-- Reconciliar el texto almacenado en producción (issue #86)
--
-- La migración de reconciliación anterior trajo los cinco objetos que faltaban,
-- y el event trigger `ensure_rls` ya funciona: una tabla creada sin pedir RLS
-- nace con RLS activo, igual que en producción.
--
-- Pero el objetivo de #86 no eran los cinco objetos: era que
-- `supabase db diff --linked` volviese a ser fiable. Y sigue devolviendo ruido
-- por dos motivos, ninguno peligroso y los dos molestos:
--
--   1. Una docena de funciones cuyo cuerpo difiere SOLO en los finales de
--      línea. Ninguna migración del repo tiene CRLF: los \r\n están en
--      producción, de haberse creado o editado desde el editor SQL del panel.
--
--   2. Dos políticas que usan `auth.jwt()` en producción y
--      `(SELECT auth.jwt())` en el repo. Es la optimización que recomienda el
--      asesor de Supabase, aplicada al fichero después de desplegarlo.
--
-- Mientras eso exista, cada diff escupe una pared de falsos positivos y nadie
-- puede distinguir ahí dentro una deriva real. Que es justo el problema que
-- abrió la issue.
--
-- Esta migración vuelve a emitir esas definiciones tomándolas literalmente de
-- los ficheros donde ya están, para que producción guarde el mismo texto. Es
-- idempotente y sin cambio de comportamiento: son las mismas definiciones que
-- ya están corriendo.

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

CREATE OR REPLACE FUNCTION handle_appointment_completed()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status != 'completed' OR OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  IF EXISTS (SELECT 1 FROM appointment_inventory_items WHERE appointment_id = NEW.id) THEN
    INSERT INTO inventory_movements (item_id, employee_id, type, quantity, notes)
    SELECT inventory_item_id, NEW.employee_id, 'out', quantity, 'Cita completada'
    FROM appointment_inventory_items WHERE appointment_id = NEW.id;
  ELSE
    INSERT INTO inventory_movements (item_id, employee_id, type, quantity, notes)
    SELECT tii.inventory_item_id, NEW.employee_id, 'out', SUM(tii.quantity), 'Cita completada'
    FROM appointment_treatments at2
    JOIN treatment_inventory_items tii ON tii.treatment_id = at2.treatment_id
    WHERE at2.appointment_id = NEW.id
    GROUP BY tii.inventory_item_id;
  END IF;

  RETURN NEW;
END;
$$;

-- Las políticas hay que borrarlas y recrearlas: CREATE OR REPLACE no
-- existe para políticas.

DROP POLICY IF EXISTS clinics_select_pending_invitation ON public.clinics;
CREATE POLICY clinics_select_pending_invitation
  ON public.clinics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.invitation_tokens invitation
      WHERE invitation.clinic_id = clinics.id
        AND invitation.used_at IS NULL
        AND invitation.expires_at > now()
        AND lower(invitation.email) = lower(coalesce((SELECT auth.jwt()) ->> 'email', ''))
    )
  );

DROP POLICY IF EXISTS invitation_tokens_select_recipient_or_manager ON public.invitation_tokens;
CREATE POLICY invitation_tokens_select_recipient_or_manager
  ON public.invitation_tokens
  FOR SELECT
  TO authenticated
  USING (
    lower(email) = lower(coalesce((SELECT auth.jwt()) ->> 'email', ''))
    OR EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = invitation_tokens.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  );

