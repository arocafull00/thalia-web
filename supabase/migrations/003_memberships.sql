ALTER TABLE clinics
  ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS specialty TEXT;

CREATE TABLE IF NOT EXISTS clinic_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('owner','admin','employee','external')),
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','active','suspended')),
  invited_by UUID REFERENCES auth.users(id),
  joined_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, clinic_id)
);

CREATE TABLE IF NOT EXISTS invitation_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin','employee','external')),
  email TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  used_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_clinic_memberships_user_id ON clinic_memberships (user_id);
CREATE INDEX IF NOT EXISTS idx_clinic_memberships_clinic_id ON clinic_memberships (clinic_id);
CREATE INDEX IF NOT EXISTS idx_invitation_tokens_token ON invitation_tokens (token);

INSERT INTO clinic_memberships (user_id, clinic_id, role, status, joined_at)
SELECT
  e.id,
  e.clinic_id,
  CASE WHEN e.role = 'admin' THEN 'admin' ELSE 'employee' END,
  'active',
  COALESCE(e.created_at, now())
FROM employees e
ON CONFLICT (user_id, clinic_id) DO NOTHING;

UPDATE clinics c
SET owner_id = sub.user_id
FROM (
  SELECT DISTINCT ON (clinic_id) clinic_id, user_id
  FROM clinic_memberships
  WHERE role IN ('owner', 'admin')
  ORDER BY clinic_id, CASE role WHEN 'owner' THEN 0 ELSE 1 END, joined_at ASC NULLS LAST
) sub
WHERE c.id = sub.clinic_id
  AND c.owner_id IS NULL;

ALTER TABLE clinic_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitation_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY clinic_memberships_select_own ON clinic_memberships
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY invitation_tokens_select_by_token ON invitation_tokens
  FOR SELECT USING (true);

CREATE POLICY invitation_tokens_update_accept ON invitation_tokens
  FOR UPDATE USING (used_at IS NULL AND expires_at > now());
