CREATE TABLE inventory_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE CASCADE,
  item_name TEXT NOT NULL,
  stock INT NOT NULL,
  min_stock INT NOT NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX inventory_alerts_active_uniq
  ON inventory_alerts (inventory_item_id)
  WHERE resolved_at IS NULL;

ALTER TABLE inventory_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "clinic members can read alerts"
  ON inventory_alerts FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM clinic_memberships
    WHERE clinic_id = inventory_alerts.clinic_id
      AND user_id = auth.uid()
      AND status = 'active'
  ));

ALTER PUBLICATION supabase_realtime ADD TABLE inventory_alerts;

CREATE OR REPLACE FUNCTION handle_inventory_alert()
RETURNS TRIGGER AS $$
BEGIN
  IF (NEW.stock - NEW.min_stock) < 10 THEN
    INSERT INTO inventory_alerts (clinic_id, inventory_item_id, item_name, stock, min_stock)
    VALUES (NEW.clinic_id, NEW.id, NEW.name, NEW.stock, NEW.min_stock)
    ON CONFLICT (inventory_item_id) WHERE resolved_at IS NULL DO UPDATE
      SET stock = EXCLUDED.stock,
          min_stock = EXCLUDED.min_stock,
          item_name = EXCLUDED.item_name;
  ELSE
    UPDATE inventory_alerts
      SET resolved_at = now()
      WHERE inventory_item_id = NEW.id AND resolved_at IS NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER inventory_alert_trigger
  AFTER INSERT OR UPDATE OF stock, min_stock ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION handle_inventory_alert();
