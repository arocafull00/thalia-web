ALTER TABLE inventory_alerts ADD COLUMN IF NOT EXISTS read_at TIMESTAMPTZ;

 CREATE POLICY "clinic members can update alerts"
    ON inventory_alerts FOR UPDATE
    USING (EXISTS (
      SELECT 1 FROM clinic_memberships
      WHERE clinic_id = inventory_alerts.clinic_id
        AND user_id = auth.uid()
        AND status = 'active'
    ));