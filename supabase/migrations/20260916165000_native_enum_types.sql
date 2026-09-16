DO $$
DECLARE
  target RECORD;
  invalid_value TEXT;
BEGIN
  FOR target IN
    SELECT *
    FROM (VALUES
      ('employees', 'role', ARRAY['admin', 'reception', 'doctor', 'auxiliary']),
      ('employees', 'account_type', ARRAY['internal', 'external']),
      ('clinic_memberships', 'role', ARRAY['owner', 'admin', 'employee', 'external']),
      ('clinic_memberships', 'status', ARRAY['pending', 'active', 'suspended']),
      ('invitation_tokens', 'role', ARRAY['admin', 'employee', 'external']),
      ('appointments', 'status', ARRAY['scheduled', 'pending_external', 'rejected_external', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show']),
      ('inventory_movements', 'type', ARRAY['in', 'out', 'adjustment']),
      ('transactions', 'type', ARRAY['income', 'expense']),
      ('transaction_categories', 'type', ARRAY['income', 'expense']),
      ('patient_images', 'phase', ARRAY['antes', 'durante', 'despues']),
      ('patient_files', 'category', ARRAY['consentimiento', 'historia_clinica', 'receta', 'analitica', 'informe', 'otro']),
      ('appointment_reminders', 'status', ARRAY['sent', 'failed']),
      ('clinic_notifications', 'type', ARRAY['external_appointment_pending', 'external_appointment_accepted', 'external_appointment_rejected', 'external_appointment_cancelled']),
      ('campaign_templates', 'approval_status', ARRAY['pending', 'approved', 'rejected']),
      ('campaigns', 'status', ARRAY['draft', 'scheduled', 'sending', 'sent', 'cancelled']),
      ('campaign_segments', 'segment_type', ARRAY['treatment_type', 'visit_count', 'last_visit_date', 'age_range', 'custom_filter']),
      ('campaign_recipients', 'status', ARRAY['pending', 'sent', 'failed']),
      ('clinic_billing', 'subscription_status', ARRAY['not_started', 'incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused'])
    ) AS targets(table_name, column_name, allowed_values)
  LOOP
    EXECUTE format(
      'SELECT %1$I::text FROM public.%2$I WHERE %1$I IS NOT NULL AND NOT (%1$I::text = ANY ($1)) LIMIT 1',
      target.column_name,
      target.table_name
    )
    INTO invalid_value
    USING target.allowed_values;

    IF invalid_value IS NOT NULL THEN
      RAISE EXCEPTION 'Invalid value "%" in %.%',
        invalid_value,
        target.table_name,
        target.column_name;
    END IF;
  END LOOP;
END;
$$;

CREATE TYPE public.employee_role AS ENUM (
  'admin',
  'reception',
  'doctor',
  'auxiliary'
);

CREATE TYPE public.employee_account_type AS ENUM (
  'internal',
  'external'
);

CREATE TYPE public.clinic_membership_role AS ENUM (
  'owner',
  'admin',
  'employee',
  'external'
);

CREATE TYPE public.clinic_membership_status AS ENUM (
  'pending',
  'active',
  'suspended'
);

CREATE TYPE public.invitation_token_role AS ENUM (
  'admin',
  'employee',
  'external'
);

CREATE TYPE public.appointment_status AS ENUM (
  'scheduled',
  'pending_external',
  'rejected_external',
  'confirmed',
  'in_progress',
  'completed',
  'cancelled',
  'no_show'
);

CREATE TYPE public.inventory_movement_type AS ENUM (
  'in',
  'out',
  'adjustment'
);

CREATE TYPE public.transaction_type AS ENUM (
  'income',
  'expense'
);

CREATE TYPE public.patient_image_phase AS ENUM (
  'antes',
  'durante',
  'despues'
);

CREATE TYPE public.patient_file_category AS ENUM (
  'consentimiento',
  'historia_clinica',
  'receta',
  'analitica',
  'informe',
  'otro'
);

CREATE TYPE public.appointment_reminder_status AS ENUM (
  'sent',
  'failed'
);

CREATE TYPE public.clinic_notification_type AS ENUM (
  'external_appointment_pending',
  'external_appointment_accepted',
  'external_appointment_rejected',
  'external_appointment_cancelled'
);

CREATE TYPE public.campaign_template_approval_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE public.campaign_status AS ENUM (
  'draft',
  'scheduled',
  'sending',
  'sent',
  'cancelled'
);

CREATE TYPE public.campaign_segment_type AS ENUM (
  'treatment_type',
  'visit_count',
  'last_visit_date',
  'age_range',
  'custom_filter'
);

CREATE TYPE public.campaign_recipient_status AS ENUM (
  'pending',
  'sent',
  'failed'
);

CREATE TYPE public.billing_status AS ENUM (
  'not_started',
  'incomplete',
  'incomplete_expired',
  'trialing',
  'active',
  'past_due',
  'canceled',
  'unpaid',
  'paused'
);

DROP VIEW public.appointments_search;

DROP POLICY clinic_billing_select_membership ON public.clinic_billing;
DROP POLICY clinic_admins_can_update_clinic ON public.clinics;
DROP POLICY clinics_select_memberships ON public.clinics;
DROP POLICY invitation_tokens_select_recipient_or_manager ON public.invitation_tokens;
DROP POLICY transaction_categories_select_managers ON public.transaction_categories;
DROP POLICY transaction_categories_insert_managers ON public.transaction_categories;
DROP POLICY transaction_categories_update_managers ON public.transaction_categories;
DROP POLICY whatsapp_config_select_managers ON public.whatsapp_config;
DROP POLICY whatsapp_config_insert_managers ON public.whatsapp_config;
DROP POLICY whatsapp_config_update_managers ON public.whatsapp_config;

DROP TRIGGER appointments_completed_deduct_inventory
  ON public.appointments;
DROP TRIGGER appointments_require_available_inventory
  ON public.appointments;
DROP TRIGGER campaigns_enforce_send_quota
  ON public.campaigns;
DROP TRIGGER clinic_memberships_global_account_type
  ON public.clinic_memberships;

ALTER TABLE public.transactions
  DROP CONSTRAINT transactions_category_id_clinic_id_type_fkey;

ALTER TABLE public.transaction_categories
  DROP CONSTRAINT transaction_categories_identity_key;

ALTER TABLE public.appointments
  DROP CONSTRAINT appointments_patient_time_no_overlap;

ALTER TABLE public.campaigns
  DROP CONSTRAINT campaigns_scheduled_requires_date,
  DROP CONSTRAINT campaigns_sending_requires_start;

DROP INDEX public.appointment_reminders_dedup_idx;
DROP INDEX public.appointments_external_overlap_idx;
DROP INDEX public.appointments_clinic_employee_start_unique;
DROP INDEX public.campaigns_consumed_send_quota_idx;
DROP INDEX public.idx_campaigns_pending_dispatch;
DROP INDEX public.idx_campaign_recipients_pending;
DROP INDEX public.patient_files_category_idx;
DROP INDEX public.transaction_categories_clinic_type_active;
DROP INDEX public.transaction_categories_unique_name;

ALTER TABLE public.employees
  ALTER COLUMN account_type DROP DEFAULT;

ALTER TABLE public.clinic_memberships
  ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.appointments
  ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.campaigns
  ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.campaign_recipients
  ALTER COLUMN status DROP DEFAULT;

ALTER TABLE public.clinic_billing
  ALTER COLUMN subscription_status DROP DEFAULT;

ALTER TABLE public.employees
  DROP CONSTRAINT employees_role_check,
  DROP CONSTRAINT employees_account_type_check,
  ALTER COLUMN role TYPE public.employee_role
    USING role::text::public.employee_role,
  ALTER COLUMN account_type TYPE public.employee_account_type
    USING account_type::text::public.employee_account_type;

ALTER TABLE public.clinic_memberships
  DROP CONSTRAINT clinic_memberships_role_check,
  DROP CONSTRAINT clinic_memberships_status_check,
  ALTER COLUMN role TYPE public.clinic_membership_role
    USING role::text::public.clinic_membership_role,
  ALTER COLUMN status TYPE public.clinic_membership_status
    USING status::text::public.clinic_membership_status;

ALTER TABLE public.invitation_tokens
  DROP CONSTRAINT invitation_tokens_role_check,
  ALTER COLUMN role TYPE public.invitation_token_role
    USING role::text::public.invitation_token_role;

ALTER TABLE public.appointments
  DROP CONSTRAINT appointments_status_check,
  ALTER COLUMN status TYPE public.appointment_status
    USING status::text::public.appointment_status;

ALTER TABLE public.inventory_movements
  DROP CONSTRAINT inventory_movements_type_check,
  ALTER COLUMN type TYPE public.inventory_movement_type
    USING type::text::public.inventory_movement_type;

ALTER TABLE public.transactions
  DROP CONSTRAINT transactions_type_check,
  ALTER COLUMN type TYPE public.transaction_type
    USING type::text::public.transaction_type;

ALTER TABLE public.transaction_categories
  DROP CONSTRAINT transaction_categories_type_check,
  ALTER COLUMN type TYPE public.transaction_type
    USING type::text::public.transaction_type;

ALTER TABLE public.patient_images
  DROP CONSTRAINT patient_images_phase_check,
  ALTER COLUMN phase TYPE public.patient_image_phase
    USING phase::text::public.patient_image_phase;

ALTER TABLE public.patient_files
  DROP CONSTRAINT patient_files_category_check,
  ALTER COLUMN category TYPE public.patient_file_category
    USING category::text::public.patient_file_category;

ALTER TABLE public.appointment_reminders
  DROP CONSTRAINT appointment_reminders_status_check,
  ALTER COLUMN status TYPE public.appointment_reminder_status
    USING status::text::public.appointment_reminder_status;

ALTER TABLE public.clinic_notifications
  DROP CONSTRAINT clinic_notifications_type_check,
  ALTER COLUMN type TYPE public.clinic_notification_type
    USING type::text::public.clinic_notification_type;

ALTER TABLE public.campaign_templates
  DROP CONSTRAINT campaign_templates_approval_status_check,
  ALTER COLUMN approval_status TYPE public.campaign_template_approval_status
    USING approval_status::text::public.campaign_template_approval_status;

ALTER TABLE public.campaigns
  DROP CONSTRAINT campaigns_status_check,
  ALTER COLUMN status TYPE public.campaign_status
    USING status::text::public.campaign_status;

ALTER TABLE public.campaign_segments
  DROP CONSTRAINT campaign_segments_segment_type_check,
  ALTER COLUMN segment_type TYPE public.campaign_segment_type
    USING segment_type::text::public.campaign_segment_type;

ALTER TABLE public.campaign_recipients
  DROP CONSTRAINT campaign_recipients_status_check,
  ALTER COLUMN status TYPE public.campaign_recipient_status
    USING status::text::public.campaign_recipient_status;

ALTER TABLE public.clinic_billing
  DROP CONSTRAINT clinic_billing_subscription_status_check,
  ALTER COLUMN subscription_status TYPE public.billing_status
    USING subscription_status::text::public.billing_status;

ALTER TABLE public.employees
  ALTER COLUMN account_type SET DEFAULT 'internal'::public.employee_account_type;

ALTER TABLE public.clinic_memberships
  ALTER COLUMN status SET DEFAULT 'pending'::public.clinic_membership_status;

ALTER TABLE public.appointments
  ALTER COLUMN status SET DEFAULT 'scheduled'::public.appointment_status;

ALTER TABLE public.campaigns
  ALTER COLUMN status SET DEFAULT 'draft'::public.campaign_status;

ALTER TABLE public.campaign_recipients
  ALTER COLUMN status SET DEFAULT 'pending'::public.campaign_recipient_status;

ALTER TABLE public.clinic_billing
  ALTER COLUMN subscription_status SET DEFAULT 'not_started'::public.billing_status;

ALTER TABLE public.campaigns
  ADD CONSTRAINT campaigns_scheduled_requires_date
    CHECK (status <> 'scheduled' OR scheduled_at IS NOT NULL),
  ADD CONSTRAINT campaigns_sending_requires_start
    CHECK (status <> 'sending' OR send_started_at IS NOT NULL);

ALTER TABLE public.transaction_categories
  ADD CONSTRAINT transaction_categories_identity_key
    UNIQUE (id, clinic_id, type);

ALTER TABLE public.transactions
  ADD CONSTRAINT transactions_category_id_clinic_id_type_fkey
    FOREIGN KEY (category_id, clinic_id, type)
    REFERENCES public.transaction_categories(id, clinic_id, type)
    ON DELETE RESTRICT;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_patient_time_no_overlap
    EXCLUDE USING gist (
      patient_id WITH =,
      tstzrange(starts_at, ends_at, '[)') WITH &&
    )
    WHERE (status NOT IN ('cancelled', 'rejected_external'));

CREATE UNIQUE INDEX appointments_clinic_employee_start_unique
  ON public.appointments (clinic_id, employee_id, starts_at)
  WHERE status NOT IN ('cancelled', 'rejected_external');

CREATE INDEX appointments_external_overlap_idx
  ON public.appointments (employee_id, starts_at, ends_at)
  WHERE status IN ('scheduled', 'confirmed', 'in_progress');

CREATE UNIQUE INDEX appointment_reminders_dedup_idx
  ON public.appointment_reminders (
    appointment_id,
    hours_before,
    reminder_type
  )
  WHERE status = 'sent';

CREATE INDEX idx_campaign_recipients_pending
  ON public.campaign_recipients (campaign_id)
  WHERE status = 'pending';

CREATE INDEX campaigns_consumed_send_quota_idx
  ON public.campaigns (clinic_id)
  WHERE status IN ('sending', 'sent') OR sent_at IS NOT NULL;

CREATE INDEX idx_campaigns_pending_dispatch
  ON public.campaigns (scheduled_at)
  WHERE status = 'scheduled';

CREATE INDEX patient_files_category_idx
  ON public.patient_files (category);

CREATE INDEX transaction_categories_clinic_type_active
  ON public.transaction_categories (clinic_id, type, is_active, name);

CREATE UNIQUE INDEX transaction_categories_unique_name
  ON public.transaction_categories (clinic_id, type, lower(name));

CREATE OR REPLACE FUNCTION public.current_employee_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT employee.role::text
  FROM public.employees employee
  WHERE employee.id = (SELECT auth.uid())
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
        AND employee.role::text = ANY(p_roles)
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
  SELECT employee.account_type::text
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
  SET status = p_status::public.clinic_membership_status
  WHERE user_id = p_employee_id
    AND clinic_id = p_clinic_id
    AND role = 'external';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'External membership not found';
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_pending_employee_invitation(
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
  invitation public.invitation_tokens;
  normalized_email TEXT;
BEGIN
  normalized_email := lower(trim(p_email));

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      p_clinic_id::text || ':' || normalized_email,
      0
    )
  );

  IF EXISTS (
    SELECT 1
    FROM public.invitation_tokens existing_invitation
    WHERE existing_invitation.clinic_id = p_clinic_id
      AND lower(trim(existing_invitation.email)) = normalized_email
      AND existing_invitation.used_at IS NULL
      AND existing_invitation.expires_at > now()
  ) THEN
    RAISE EXCEPTION 'invitation_already_pending';
  END IF;

  INSERT INTO public.invitation_tokens (
    clinic_id,
    role,
    email,
    created_by,
    expires_at
  )
  VALUES (
    p_clinic_id,
    p_role::public.invitation_token_role,
    normalized_email,
    p_created_by,
    p_expires_at
  )
  RETURNING * INTO invitation;

  RETURN invitation;
END;
$$;

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
  normalized_email TEXT;
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

  normalized_email := lower(trim(p_email));

  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      p_clinic_id::text || ':' || normalized_email,
      0
    )
  );

  IF EXISTS (
    SELECT 1
    FROM public.invitation_tokens invitation
    WHERE invitation.clinic_id = p_clinic_id
      AND invitation.id <> p_invitation_id
      AND lower(trim(invitation.email)) = normalized_email
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
    p_role::public.invitation_token_role,
    normalized_email,
    p_created_by,
    p_expires_at
  )
  RETURNING * INTO replacement;

  RETURN replacement;
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
    AND existing_employee.account_type::text <> account_type
  THEN
    RAISE EXCEPTION 'invitation_account_type_conflict';
  END IF;

  IF invitation.role <> 'external' AND active_membership_count > 0 THEN
    RAISE EXCEPTION 'user_already_belongs_to_clinic';
  END IF;

  operational_role := existing_employee.role::text;

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
      account_type::public.employee_account_type,
      coalesce(
        nullif(trim(p_full_name), ''),
        split_part(p_user_email, '@', 1),
        'Empleado'
      ),
      operational_role::public.employee_role,
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
    invitation.role::text::public.clinic_membership_role,
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

CREATE OR REPLACE FUNCTION public.apply_stripe_billing_event(
  p_event_id TEXT,
  p_event_type TEXT,
  p_event_created_at TIMESTAMPTZ,
  p_clinic_id UUID,
  p_stripe_customer_id TEXT,
  p_stripe_subscription_id TEXT,
  p_subscription_status TEXT,
  p_trial_ends_at TIMESTAMPTZ,
  p_current_period_ends_at TIMESTAMPTZ,
  p_cancel_at_period_end BOOLEAN
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
DECLARE
  inserted_event_count INTEGER;
BEGIN
  IF p_subscription_status NOT IN (
    'not_started',
    'incomplete',
    'incomplete_expired',
    'trialing',
    'active',
    'past_due',
    'canceled',
    'unpaid',
    'paused'
  ) THEN
    RAISE EXCEPTION 'invalid_subscription_status';
  END IF;

  INSERT INTO private.stripe_webhook_events (
    event_id,
    event_type,
    event_created_at
  )
  VALUES (
    p_event_id,
    p_event_type,
    p_event_created_at
  )
  ON CONFLICT (event_id) DO NOTHING;

  GET DIAGNOSTICS inserted_event_count = ROW_COUNT;

  IF inserted_event_count = 0 THEN
    RETURN false;
  END IF;

  INSERT INTO public.clinic_billing (
    clinic_id,
    stripe_customer_id,
    stripe_subscription_id,
    subscription_status,
    trial_ends_at,
    current_period_ends_at,
    cancel_at_period_end,
    last_stripe_event_id,
    last_stripe_event_created_at
  )
  VALUES (
    p_clinic_id,
    p_stripe_customer_id,
    p_stripe_subscription_id,
    p_subscription_status::public.billing_status,
    p_trial_ends_at,
    p_current_period_ends_at,
    p_cancel_at_period_end,
    p_event_id,
    p_event_created_at
  )
  ON CONFLICT (clinic_id) DO UPDATE
  SET
    stripe_customer_id = COALESCE(
      EXCLUDED.stripe_customer_id,
      clinic_billing.stripe_customer_id
    ),
    stripe_subscription_id = COALESCE(
      EXCLUDED.stripe_subscription_id,
      clinic_billing.stripe_subscription_id
    ),
    subscription_status = EXCLUDED.subscription_status,
    trial_ends_at = EXCLUDED.trial_ends_at,
    current_period_ends_at = EXCLUDED.current_period_ends_at,
    cancel_at_period_end = EXCLUDED.cancel_at_period_end,
    last_stripe_event_id = EXCLUDED.last_stripe_event_id,
    last_stripe_event_created_at = EXCLUDED.last_stripe_event_created_at
  WHERE clinic_billing.last_stripe_event_created_at IS NULL
    OR EXCLUDED.last_stripe_event_created_at
      >= clinic_billing.last_stripe_event_created_at;

  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_appointment_confirmation(p_token UUID)
RETURNS TABLE (
  state TEXT,
  patient_first_name TEXT,
  clinic_name TEXT,
  clinic_phone TEXT,
  clinic_timezone TEXT,
  employee_name TEXT,
  starts_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    appointment_confirmation_state(
      a.status::text,
      a.starts_at,
      t.expires_at,
      t.confirmed_at
    ),
    split_part(p.full_name, ' ', 1),
    c.name,
    c.phone,
    c.timezone,
    e.full_name,
    a.starts_at
  FROM appointment_confirmation_tokens t
  JOIN appointments a ON a.id = t.appointment_id
  JOIN clinics c ON c.id = a.clinic_id
  JOIN patients p ON p.id = a.patient_id
  JOIN employees e ON e.id = a.employee_id
  WHERE t.token = p_token;
$$;

CREATE OR REPLACE FUNCTION public.confirm_appointment_by_token(p_token UUID)
RETURNS TABLE (
  state TEXT,
  patient_first_name TEXT,
  clinic_name TEXT,
  clinic_phone TEXT,
  clinic_timezone TEXT,
  employee_name TEXT,
  starts_at TIMESTAMPTZ
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token appointment_confirmation_tokens%ROWTYPE;
  v_appointment appointments%ROWTYPE;
  v_state TEXT;
BEGIN
  SELECT * INTO v_token
  FROM appointment_confirmation_tokens
  WHERE token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  SELECT * INTO v_appointment
  FROM appointments
  WHERE id = v_token.appointment_id
  FOR UPDATE;

  v_state := appointment_confirmation_state(
    v_appointment.status::text,
    v_appointment.starts_at,
    v_token.expires_at,
    v_token.confirmed_at
  );

  IF v_state = 'confirmable' THEN
    UPDATE appointments
    SET status = 'confirmed', updated_at = now()
    WHERE id = v_appointment.id;

    UPDATE appointment_confirmation_tokens
    SET confirmed_at = now()
    WHERE id = v_token.id;
  END IF;

  RETURN QUERY SELECT * FROM get_appointment_confirmation(p_token);
END;
$$;

CREATE TRIGGER appointments_completed_deduct_inventory
  AFTER UPDATE OF status ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.handle_appointment_completed();

CREATE TRIGGER appointments_require_available_inventory
  BEFORE UPDATE OF status ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION public.assert_appointment_inventory_available();

CREATE TRIGGER campaigns_enforce_send_quota
  BEFORE INSERT OR UPDATE OF status, sent_at ON public.campaigns
  FOR EACH ROW EXECUTE FUNCTION private.enforce_campaign_send_quota();

CREATE TRIGGER clinic_memberships_global_account_type
  BEFORE INSERT OR UPDATE OF user_id, role ON public.clinic_memberships
  FOR EACH ROW EXECUTE FUNCTION private.enforce_global_account_type();

CREATE OR REPLACE VIEW public.appointments_search
WITH (security_invoker = true) AS
  SELECT
    appointment.id,
    appointment.clinic_id,
    appointment.employee_id,
    appointment.starts_at,
    appointment.status,
    lower(
      concat_ws(
        ' ',
        patient.full_name,
        patient.phone,
        string_agg(treatment.name, ' ')
      )
    ) AS search_text
  FROM public.appointments appointment
  LEFT JOIN public.patients patient
    ON patient.id = appointment.patient_id
  LEFT JOIN public.appointment_treatments appointment_treatment
    ON appointment_treatment.appointment_id = appointment.id
  LEFT JOIN public.treatment treatment
    ON treatment.id = appointment_treatment.treatment_id
  GROUP BY
    appointment.id,
    appointment.clinic_id,
    appointment.employee_id,
    appointment.starts_at,
    appointment.status,
    patient.full_name,
    patient.phone;

GRANT SELECT ON public.appointments_search TO authenticated, service_role;

CREATE POLICY clinic_billing_select_membership
  ON public.clinic_billing
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = clinic_billing.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.status = 'active'
    )
  );

CREATE POLICY clinics_select_memberships
  ON public.clinics
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = clinics.id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.status = 'active'
    )
  );

CREATE POLICY clinic_admins_can_update_clinic
  ON public.clinics
  FOR UPDATE
  TO authenticated
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

CREATE POLICY invitation_tokens_select_recipient_or_manager
  ON public.invitation_tokens
  FOR SELECT
  TO authenticated
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

CREATE POLICY transaction_categories_select_managers
  ON public.transaction_categories
  FOR SELECT
  TO authenticated
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

CREATE POLICY transaction_categories_insert_managers
  ON public.transaction_categories
  FOR INSERT
  TO authenticated
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

CREATE POLICY transaction_categories_update_managers
  ON public.transaction_categories
  FOR UPDATE
  TO authenticated
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

CREATE POLICY whatsapp_config_select_managers
  ON public.whatsapp_config
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = whatsapp_config.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  );

CREATE POLICY whatsapp_config_insert_managers
  ON public.whatsapp_config
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = whatsapp_config.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  );

CREATE POLICY whatsapp_config_update_managers
  ON public.whatsapp_config
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = whatsapp_config.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = whatsapp_config.clinic_id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  );

GRANT USAGE ON TYPE
  public.employee_role,
  public.employee_account_type,
  public.clinic_membership_role,
  public.clinic_membership_status,
  public.invitation_token_role,
  public.appointment_status,
  public.inventory_movement_type,
  public.transaction_type,
  public.patient_image_phase,
  public.patient_file_category,
  public.appointment_reminder_status,
  public.clinic_notification_type,
  public.campaign_template_approval_status,
  public.campaign_status,
  public.campaign_segment_type,
  public.campaign_recipient_status,
  public.billing_status
TO anon, authenticated, service_role;
