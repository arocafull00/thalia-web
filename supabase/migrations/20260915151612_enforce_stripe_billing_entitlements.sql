CREATE OR REPLACE FUNCTION private.clinic_billing_allows_access(
  p_clinic_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT
    COALESCE((
      SELECT employee.account_type = 'external'
      FROM public.employees employee
      WHERE employee.id = (SELECT auth.uid())
    ), false)
    OR EXISTS (
      SELECT 1
      FROM public.clinic_billing billing
      WHERE billing.clinic_id = p_clinic_id
        AND billing.subscription_status IN ('trialing', 'active')
    )
$$;

REVOKE ALL ON FUNCTION private.clinic_billing_allows_access(UUID)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.clinic_billing_allows_access(UUID)
  TO authenticated;

CREATE OR REPLACE FUNCTION private.has_active_clinic_access(p_clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = p_clinic_id
        AND membership.status = 'active'
    )
    AND (SELECT private.clinic_billing_allows_access(p_clinic_id))
$$;

CREATE OR REPLACE FUNCTION private.is_clinic_owner(p_clinic_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT
    (SELECT private.has_active_clinic_access(p_clinic_id))
    AND EXISTS (
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
      AND (SELECT private.clinic_billing_allows_access(
        viewer_membership.clinic_id
      ))
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
        AND (SELECT private.clinic_billing_allows_access(
          employee_membership.clinic_id
        ))
    )
$$;

CREATE OR REPLACE FUNCTION public.current_employee_clinic_id()
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
    AND (SELECT private.clinic_billing_allows_access(membership.clinic_id))
  ORDER BY membership.joined_at NULLS LAST, membership.created_at
  LIMIT 1
$$;

DROP POLICY IF EXISTS clinics_select_memberships ON public.clinics;
CREATE POLICY clinics_select_memberships
  ON public.clinics FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = clinics.id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.status = 'active'
    )
  );

DROP POLICY IF EXISTS clinic_admins_can_update_clinic ON public.clinics;
CREATE POLICY clinic_admins_can_update_clinic
  ON public.clinics FOR UPDATE TO authenticated
  USING (
    (SELECT private.has_active_clinic_access(id))
    AND EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = clinics.id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  )
  WITH CHECK (
    (SELECT private.has_active_clinic_access(id))
    AND EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = clinics.id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  );

DROP POLICY IF EXISTS invitation_tokens_select_recipient_or_manager
  ON public.invitation_tokens;
CREATE POLICY invitation_tokens_select_recipient_or_manager
  ON public.invitation_tokens FOR SELECT TO authenticated
  USING (
    lower(email) = lower(coalesce((SELECT auth.jwt()) ->> 'email', ''))
    OR (
      (SELECT private.has_active_clinic_access(invitation_tokens.clinic_id))
      AND EXISTS (
        SELECT 1
        FROM public.clinic_memberships membership
        WHERE membership.clinic_id = invitation_tokens.clinic_id
          AND membership.user_id = (SELECT auth.uid())
          AND membership.status = 'active'
          AND membership.role IN ('owner', 'admin')
      )
    )
  );

DROP POLICY IF EXISTS "clinic members can read alerts"
  ON public.inventory_alerts;
CREATE POLICY "clinic members can read alerts"
  ON public.inventory_alerts FOR SELECT TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(inventory_alerts.clinic_id))
  );

DROP POLICY IF EXISTS "clinic members can update alerts"
  ON public.inventory_alerts;
CREATE POLICY "clinic members can update alerts"
  ON public.inventory_alerts FOR UPDATE TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(inventory_alerts.clinic_id))
  )
  WITH CHECK (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(inventory_alerts.clinic_id))
  );

DROP POLICY IF EXISTS "clinic_members_can_read_reminders"
  ON public.appointment_reminders;
CREATE POLICY "clinic_members_can_read_reminders"
  ON public.appointment_reminders FOR SELECT TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(
      appointment_reminders.clinic_id
    ))
  );

DROP POLICY IF EXISTS "clinic_members_can_read_confirmation_tokens"
  ON public.appointment_confirmation_tokens;
CREATE POLICY "clinic_members_can_read_confirmation_tokens"
  ON public.appointment_confirmation_tokens FOR SELECT TO authenticated
  USING (
    NOT (SELECT private.is_external_user())
    AND (SELECT private.has_active_clinic_access(
      appointment_confirmation_tokens.clinic_id
    ))
  );

DROP POLICY IF EXISTS transaction_categories_select_managers
  ON public.transaction_categories;
CREATE POLICY transaction_categories_select_managers
  ON public.transaction_categories FOR SELECT TO authenticated
  USING (
    (SELECT private.has_active_clinic_access(transaction_categories.clinic_id))
    AND EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = transaction_categories.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS transaction_categories_insert_managers
  ON public.transaction_categories;
CREATE POLICY transaction_categories_insert_managers
  ON public.transaction_categories FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT private.has_active_clinic_access(transaction_categories.clinic_id))
    AND EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = transaction_categories.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  );

DROP POLICY IF EXISTS transaction_categories_update_managers
  ON public.transaction_categories;
CREATE POLICY transaction_categories_update_managers
  ON public.transaction_categories FOR UPDATE TO authenticated
  USING (
    (SELECT private.has_active_clinic_access(transaction_categories.clinic_id))
    AND EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = transaction_categories.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    (SELECT private.has_active_clinic_access(transaction_categories.clinic_id))
    AND EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = transaction_categories.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  );
