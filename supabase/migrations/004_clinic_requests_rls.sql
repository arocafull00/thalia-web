DROP POLICY IF EXISTS invitation_tokens_select_by_token ON invitation_tokens;

CREATE POLICY invitation_tokens_select ON invitation_tokens
  FOR SELECT
  USING (
    auth.uid() IS NULL
    OR lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

CREATE POLICY clinics_select_pending_invitation ON clinics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1
      FROM invitation_tokens it
      WHERE it.clinic_id = clinics.id
        AND it.used_at IS NULL
        AND it.expires_at > now()
        AND (
          auth.uid() IS NULL
          OR lower(it.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
        )
    )
  );

CREATE INDEX IF NOT EXISTS idx_invitation_tokens_email_pending
  ON invitation_tokens (lower(email))
  WHERE used_at IS NULL;
