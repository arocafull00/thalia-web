ALTER TABLE campaigns
  DROP CONSTRAINT IF EXISTS campaigns_status_check;

ALTER TABLE campaigns
  ADD COLUMN send_started_at TIMESTAMPTZ,
  ADD CONSTRAINT campaigns_status_check
    CHECK (status IN ('draft', 'scheduled', 'sending', 'sent', 'cancelled')),
  ADD CONSTRAINT campaigns_sending_requires_start
    CHECK (status <> 'sending' OR send_started_at IS NOT NULL);

CREATE INDEX campaigns_consumed_send_quota_idx
  ON campaigns (clinic_id)
  WHERE status IN ('sending', 'sent') OR sent_at IS NOT NULL;

CREATE OR REPLACE FUNCTION public.get_campaign_quota(p_clinic_id UUID)
RETURNS TABLE (
  used BIGINT,
  campaign_limit INT,
  reached BOOLEAN
)
LANGUAGE SQL
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT
    count(*) AS used,
    2 AS campaign_limit,
    count(*) >= 2 AS reached
  FROM campaigns
  WHERE clinic_id = p_clinic_id
    AND (status IN ('sending', 'sent') OR sent_at IS NOT NULL);
$$;

REVOKE ALL ON FUNCTION public.get_campaign_quota(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_campaign_quota(UUID)
  TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.enforce_campaign_send_quota()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public, private
AS $$
DECLARE
  v_used BIGINT;
  v_old_consumes_quota BOOLEAN;
  v_new_consumes_quota BOOLEAN;
BEGIN
  v_new_consumes_quota :=
    NEW.status IN ('sending', 'sent') OR NEW.sent_at IS NOT NULL;

  IF TG_OP = 'UPDATE' THEN
    v_old_consumes_quota :=
      OLD.status IN ('sending', 'sent') OR OLD.sent_at IS NOT NULL;

    IF NOT v_new_consumes_quota OR v_old_consumes_quota THEN
      RETURN NEW;
    END IF;
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended('campaign_quota:' || NEW.clinic_id::text, 0)
  );

  SELECT count(*) INTO v_used
  FROM campaigns
  WHERE clinic_id = NEW.clinic_id
    AND (status IN ('sending', 'sent') OR sent_at IS NOT NULL)
    AND (TG_OP = 'INSERT' OR id <> NEW.id);

  IF v_used >= 2 THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'campaign_sent_limit_reached';
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.enforce_campaign_send_quota() FROM PUBLIC;

CREATE TRIGGER campaigns_enforce_send_quota
  BEFORE INSERT OR UPDATE OF status, sent_at ON campaigns
  FOR EACH ROW EXECUTE FUNCTION private.enforce_campaign_send_quota();

CREATE OR REPLACE FUNCTION public.claim_campaign_send_slot(
  p_campaign_id UUID
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
DECLARE
  v_campaign campaigns%ROWTYPE;
  v_used BIGINT;
BEGIN
  SELECT * INTO v_campaign
  FROM campaigns
  WHERE id = p_campaign_id;

  IF NOT FOUND THEN
    RETURN 'campaign_not_found';
  END IF;

  PERFORM pg_advisory_xact_lock(
    hashtextextended('campaign_quota:' || v_campaign.clinic_id::text, 0)
  );

  SELECT * INTO v_campaign
  FROM campaigns
  WHERE id = p_campaign_id
  FOR UPDATE;

  IF v_campaign.status = 'sending' THEN
    RETURN 'campaign_send_in_progress';
  END IF;

  IF v_campaign.status <> 'draft' OR v_campaign.sent_at IS NOT NULL THEN
    RETURN 'campaign_not_sendable';
  END IF;

  SELECT count(*) INTO v_used
  FROM campaigns
  WHERE clinic_id = v_campaign.clinic_id
    AND id <> p_campaign_id
    AND (status IN ('sending', 'sent') OR sent_at IS NOT NULL);

  IF v_used >= 2 THEN
    RETURN 'campaign_sent_limit_reached';
  END IF;

  UPDATE campaigns
  SET status = 'sending', send_started_at = now()
  WHERE id = p_campaign_id;

  RETURN 'claimed';
END;
$$;

REVOKE ALL ON FUNCTION public.claim_campaign_send_slot(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_campaign_send_slot(UUID)
  TO service_role;
