ALTER TABLE treatment_types ADD COLUMN IF NOT EXISTS category TEXT;

CREATE INDEX IF NOT EXISTS idx_treatment_types_category ON treatment_types (category);

CREATE TABLE treatment_type_inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  treatment_type_id UUID NOT NULL REFERENCES treatment_types(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
  quantity NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (treatment_type_id, inventory_item_id)
);

CREATE INDEX idx_treatment_type_inventory_items_treatment ON treatment_type_inventory_items (treatment_type_id);
CREATE INDEX idx_treatment_type_inventory_items_item ON treatment_type_inventory_items (inventory_item_id);

ALTER TABLE treatment_type_inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY treatment_type_inventory_items_select_same_clinic ON treatment_type_inventory_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM treatment_types
      WHERE treatment_types.id = treatment_type_inventory_items.treatment_type_id
      AND treatment_types.clinic_id = current_employee_clinic_id()
    )
  );

CREATE POLICY treatment_type_inventory_items_write_same_clinic ON treatment_type_inventory_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM treatment_types
      WHERE treatment_types.id = treatment_type_inventory_items.treatment_type_id
      AND treatment_types.clinic_id = current_employee_clinic_id()
    )
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = treatment_type_inventory_items.inventory_item_id
      AND inventory_items.clinic_id = current_employee_clinic_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM treatment_types
      WHERE treatment_types.id = treatment_type_inventory_items.treatment_type_id
      AND treatment_types.clinic_id = current_employee_clinic_id()
    )
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = treatment_type_inventory_items.inventory_item_id
      AND inventory_items.clinic_id = current_employee_clinic_id()
    )
  );
