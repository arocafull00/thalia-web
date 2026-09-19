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
SECURITY DEFINER
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

REVOKE ALL ON FUNCTION public.apply_stripe_billing_event(
  TEXT,
  TEXT,
  TIMESTAMPTZ,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TIMESTAMPTZ,
  TIMESTAMPTZ,
  BOOLEAN
) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.apply_stripe_billing_event(
  TEXT,
  TEXT,
  TIMESTAMPTZ,
  UUID,
  TEXT,
  TEXT,
  TEXT,
  TIMESTAMPTZ,
  TIMESTAMPTZ,
  BOOLEAN
) TO service_role;
