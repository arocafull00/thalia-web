ALTER TABLE public.invitation_tokens
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ;

UPDATE public.invitation_tokens
SET created_at = expires_at - INTERVAL '7 days'
WHERE created_at IS NULL;

ALTER TABLE public.invitation_tokens
  ALTER COLUMN created_at SET DEFAULT now(),
  ALTER COLUMN created_at SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_invitation_tokens_clinic_pending_created
  ON public.invitation_tokens (clinic_id, created_at DESC)
  WHERE used_at IS NULL;

DROP POLICY IF EXISTS invitation_tokens_select ON public.invitation_tokens;
DROP POLICY IF EXISTS invitation_tokens_update_accept ON public.invitation_tokens;

REVOKE ALL ON TABLE public.invitation_tokens FROM anon, authenticated;
GRANT SELECT ON TABLE public.invitation_tokens TO authenticated;

CREATE POLICY invitation_tokens_select_recipient_or_manager
  ON public.invitation_tokens
  FOR SELECT
  TO authenticated
  USING (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    OR EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = invitation_tokens.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  );

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
        AND lower(invitation.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

CREATE OR REPLACE FUNCTION public.replace_pending_employee_invitation(
  p_invitation_id UUID,
  p_clinic_id UUID,
  p_email TEXT,
  p_role TEXT,
  p_created_by UUID,
  p_expires_at TIMESTAMPTZ
)
RETURNS public.invitation_tokens
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  current_invitation public.invitation_tokens;
  replacement public.invitation_tokens;
BEGIN
  SELECT invitation.*
  INTO current_invitation
  FROM public.invitation_tokens invitation
  WHERE invitation.id = p_invitation_id
    AND invitation.clinic_id = p_clinic_id
  FOR UPDATE;

  IF NOT FOUND
    OR current_invitation.used_at IS NOT NULL
    OR current_invitation.expires_at <= now()
  THEN
    RAISE EXCEPTION 'invitation_not_pending';
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.invitation_tokens invitation
    WHERE invitation.clinic_id = p_clinic_id
      AND invitation.id <> p_invitation_id
      AND lower(invitation.email) = lower(p_email)
      AND invitation.used_at IS NULL
      AND invitation.expires_at > now()
  ) THEN
    RAISE EXCEPTION 'invitation_already_pending';
  END IF;

  DELETE FROM public.invitation_tokens
  WHERE id = p_invitation_id;

  INSERT INTO public.invitation_tokens (
    clinic_id,
    role,
    email,
    created_by,
    expires_at
  )
  VALUES (
    p_clinic_id,
    p_role,
    lower(trim(p_email)),
    p_created_by,
    p_expires_at
  )
  RETURNING * INTO replacement;

  RETURN replacement;
END;
$$;

CREATE OR REPLACE FUNCTION public.cancel_pending_employee_invitation(
  p_invitation_id UUID,
  p_clinic_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  deleted_id UUID;
BEGIN
  DELETE FROM public.invitation_tokens
  WHERE id = p_invitation_id
    AND clinic_id = p_clinic_id
    AND used_at IS NULL
    AND expires_at > now()
  RETURNING id INTO deleted_id;

  IF deleted_id IS NULL THEN
    RAISE EXCEPTION 'invitation_not_pending';
  END IF;

  RETURN deleted_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.consume_employee_invitation(
  p_token UUID,
  p_user_id UUID,
  p_user_email TEXT,
  p_action TEXT,
  p_full_name TEXT DEFAULT NULL,
  p_employee_role TEXT DEFAULT NULL,
  p_specialty TEXT DEFAULT NULL,
  p_color TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  invitation public.invitation_tokens;
  existing_employee public.employees;
  account_type TEXT;
  operational_role TEXT;
  active_membership_count INTEGER;
BEGIN
  IF p_action NOT IN ('accept', 'reject') THEN
    RAISE EXCEPTION 'invalid_invitation_action';
  END IF;

  SELECT token_row.*
  INTO invitation
  FROM public.invitation_tokens token_row
  WHERE token_row.token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'invitation_not_found';
  END IF;

  IF invitation.used_at IS NOT NULL THEN
    RAISE EXCEPTION 'invitation_already_used';
  END IF;

  IF invitation.expires_at <= now() THEN
    RAISE EXCEPTION 'invitation_expired';
  END IF;

  IF lower(trim(p_user_email)) <> lower(trim(invitation.email)) THEN
    RAISE EXCEPTION 'invitation_email_mismatch';
  END IF;

  IF p_action = 'reject' THEN
    UPDATE public.invitation_tokens
    SET used_at = now(), used_by = p_user_id
    WHERE id = invitation.id;

    RETURN jsonb_build_object('rejected', true);
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.clinic_memberships membership
    WHERE membership.user_id = p_user_id
      AND membership.clinic_id = invitation.clinic_id
  ) THEN
    RAISE EXCEPTION 'already_member_of_clinic';
  END IF;

  SELECT count(*)
  INTO active_membership_count
  FROM public.clinic_memberships membership
  WHERE membership.user_id = p_user_id
    AND membership.status = 'active';

  IF EXISTS (
    SELECT 1
    FROM public.clinic_memberships membership
    WHERE membership.user_id = p_user_id
      AND membership.status = 'active'
      AND membership.role = 'owner'
  ) THEN
    RAISE EXCEPTION 'owner_cannot_join_other_clinics';
  END IF;

  SELECT employee.*
  INTO existing_employee
  FROM public.employees employee
  WHERE employee.id = p_user_id;

  account_type := CASE
    WHEN invitation.role = 'external' THEN 'external'
    ELSE 'internal'
  END;

  IF existing_employee.id IS NOT NULL
    AND existing_employee.account_type <> account_type
  THEN
    RAISE EXCEPTION 'invitation_account_type_conflict';
  END IF;

  IF invitation.role <> 'external' AND active_membership_count > 0 THEN
    RAISE EXCEPTION 'user_already_belongs_to_clinic';
  END IF;

  operational_role := existing_employee.role;

  IF operational_role IS NULL AND invitation.role = 'admin' THEN
    operational_role := 'admin';
  END IF;

  IF operational_role IS NULL
    AND p_employee_role IN ('doctor', 'reception', 'auxiliary')
  THEN
    operational_role := p_employee_role;
  END IF;

  IF operational_role IS NULL THEN
    RAISE EXCEPTION 'employee_role_required';
  END IF;

  IF existing_employee.id IS NULL THEN
    INSERT INTO public.employees (
      id,
      account_type,
      full_name,
      role,
      specialty,
      color,
      active
    )
    VALUES (
      p_user_id,
      account_type,
      coalesce(nullif(trim(p_full_name), ''), split_part(p_user_email, '@', 1), 'Empleado'),
      operational_role,
      nullif(trim(p_specialty), ''),
      nullif(trim(p_color), ''),
      true
    );
  END IF;

  INSERT INTO public.clinic_memberships (
    user_id,
    clinic_id,
    role,
    status,
    invited_by,
    joined_at
  )
  VALUES (
    p_user_id,
    invitation.clinic_id,
    invitation.role,
    'active',
    invitation.created_by,
    now()
  );

  UPDATE public.invitation_tokens
  SET used_at = now(), used_by = p_user_id
  WHERE id = invitation.id;

  RETURN jsonb_build_object(
    'clinicId', invitation.clinic_id,
    'role', invitation.role
  );
END;
$$;

REVOKE ALL ON FUNCTION public.replace_pending_employee_invitation(UUID, UUID, TEXT, TEXT, UUID, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.cancel_pending_employee_invitation(UUID, UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.consume_employee_invitation(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.replace_pending_employee_invitation(UUID, UUID, TEXT, TEXT, UUID, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION public.cancel_pending_employee_invitation(UUID, UUID) TO service_role;
GRANT EXECUTE ON FUNCTION public.consume_employee_invitation(UUID, UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO service_role;
