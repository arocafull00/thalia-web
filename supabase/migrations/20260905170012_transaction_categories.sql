CREATE TABLE transaction_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  name TEXT NOT NULL CHECK (
    name = btrim(name)
    AND char_length(name) BETWEEN 1 AND 100
  ),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT transaction_categories_identity_key UNIQUE (id, clinic_id, type)
);

CREATE UNIQUE INDEX transaction_categories_unique_name
  ON transaction_categories (clinic_id, type, (lower(name)));

CREATE INDEX transaction_categories_clinic_type_active
  ON transaction_categories (clinic_id, type, is_active, name);

CREATE TRIGGER transaction_categories_updated_at
  BEFORE UPDATE ON transaction_categories
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

ALTER TABLE transaction_categories ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE transaction_categories FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE transaction_categories TO authenticated;
GRANT SELECT, INSERT, UPDATE ON TABLE transaction_categories TO service_role;

CREATE POLICY transaction_categories_select_managers
  ON transaction_categories
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = transaction_categories.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  );

CREATE POLICY transaction_categories_insert_managers
  ON transaction_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = transaction_categories.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  );

CREATE POLICY transaction_categories_update_managers
  ON transaction_categories
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = transaction_categories.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM clinic_memberships membership
      WHERE membership.user_id = (SELECT auth.uid())
        AND membership.clinic_id = transaction_categories.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin')
    )
  );

INSERT INTO transaction_categories (clinic_id, type, name)
SELECT DISTINCT ON (clinic_id, type, lower(btrim(category)))
  clinic_id,
  type,
  btrim(category)
FROM transactions
WHERE category IS NOT NULL
  AND btrim(category) <> ''
ORDER BY
  clinic_id,
  type,
  lower(btrim(category)),
  created_at ASC NULLS LAST,
  id;

INSERT INTO transaction_categories (clinic_id, type, name)
SELECT clinic.id, defaults.type, defaults.name
FROM clinics clinic
CROSS JOIN (
  VALUES
    ('income', 'Tratamientos'),
    ('income', 'Productos'),
    ('expense', 'Nóminas'),
    ('expense', 'Alquiler'),
    ('expense', 'Marketing'),
    ('expense', 'Material sanitario')
) AS defaults(type, name)
ON CONFLICT (clinic_id, type, (lower(name))) DO NOTHING;

ALTER TABLE transactions ADD COLUMN category_id UUID;

UPDATE transactions t
SET category_id = category.id
FROM transaction_categories category
WHERE t.category IS NOT NULL
  AND btrim(t.category) <> ''
  AND category.clinic_id = t.clinic_id
  AND category.type = t.type
  AND lower(category.name) = lower(btrim(t.category));

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM transactions
    WHERE category IS NOT NULL
      AND btrim(category) <> ''
      AND category_id IS NULL
  ) THEN
    RAISE EXCEPTION 'Transaction category backfill is incomplete';
  END IF;
END;
$$;

ALTER TABLE transactions DROP COLUMN category;

ALTER TABLE transactions
  ADD CONSTRAINT transactions_category_id_clinic_id_type_fkey
  FOREIGN KEY (category_id, clinic_id, type)
  REFERENCES transaction_categories (id, clinic_id, type)
  ON DELETE RESTRICT;

CREATE INDEX idx_transactions_category_id ON transactions (category_id);

CREATE OR REPLACE FUNCTION seed_default_transaction_categories()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  INSERT INTO transaction_categories (clinic_id, type, name)
  VALUES
    (NEW.id, 'income', 'Tratamientos'),
    (NEW.id, 'income', 'Productos'),
    (NEW.id, 'expense', 'Nóminas'),
    (NEW.id, 'expense', 'Alquiler'),
    (NEW.id, 'expense', 'Marketing'),
    (NEW.id, 'expense', 'Material sanitario')
  ON CONFLICT (clinic_id, type, (lower(name))) DO NOTHING;

  RETURN NEW;
END;
$$;

CREATE TRIGGER clinics_seed_default_transaction_categories
  AFTER INSERT ON clinics
  FOR EACH ROW EXECUTE FUNCTION seed_default_transaction_categories();
