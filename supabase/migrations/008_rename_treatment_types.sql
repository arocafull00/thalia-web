ALTER TABLE treatment_types RENAME TO treatment;

ALTER TABLE treatment_type_inventory_items RENAME TO treatment_inventory_items;

ALTER TABLE treatment_inventory_items
  RENAME COLUMN treatment_type_id TO treatment_id;

ALTER TABLE appointment_treatments
  RENAME COLUMN treatment_type_id TO treatment_id;

ALTER INDEX IF EXISTS idx_treatment_types_category RENAME TO idx_treatment_category;
ALTER INDEX IF EXISTS idx_treatment_type_inventory_items_treatment RENAME TO idx_treatment_inventory_items_treatment;
ALTER INDEX IF EXISTS idx_treatment_type_inventory_items_item RENAME TO idx_treatment_inventory_items_item;

ALTER TRIGGER treatment_types_updated_at ON treatment RENAME TO treatment_updated_at;

ALTER POLICY treatment_types_same_clinic ON treatment RENAME TO treatment_same_clinic;

DROP POLICY IF EXISTS treatment_type_inventory_items_select_same_clinic ON treatment_inventory_items;
DROP POLICY IF EXISTS treatment_type_inventory_items_write_same_clinic ON treatment_inventory_items;

CREATE POLICY treatment_inventory_items_select_same_clinic ON treatment_inventory_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM treatment
      WHERE treatment.id = treatment_inventory_items.treatment_id
      AND treatment.clinic_id = current_employee_clinic_id()
    )
  );

CREATE POLICY treatment_inventory_items_write_same_clinic ON treatment_inventory_items
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM treatment
      WHERE treatment.id = treatment_inventory_items.treatment_id
      AND treatment.clinic_id = current_employee_clinic_id()
    )
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = treatment_inventory_items.inventory_item_id
      AND inventory_items.clinic_id = current_employee_clinic_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM treatment
      WHERE treatment.id = treatment_inventory_items.treatment_id
      AND treatment.clinic_id = current_employee_clinic_id()
    )
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = treatment_inventory_items.inventory_item_id
      AND inventory_items.clinic_id = current_employee_clinic_id()
    )
  );

CREATE OR REPLACE FUNCTION handle_appointment_completed()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status != 'completed' OR OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  IF EXISTS (SELECT 1 FROM appointment_inventory_items WHERE appointment_id = NEW.id) THEN
    INSERT INTO inventory_movements (item_id, employee_id, type, quantity, notes)
    SELECT inventory_item_id, NEW.employee_id, 'out', quantity, 'Cita completada'
    FROM appointment_inventory_items WHERE appointment_id = NEW.id;
  ELSE
    INSERT INTO inventory_movements (item_id, employee_id, type, quantity, notes)
    SELECT tii.inventory_item_id, NEW.employee_id, 'out', SUM(tii.quantity), 'Cita completada'
    FROM appointment_treatments at2
    JOIN treatment_inventory_items tii ON tii.treatment_id = at2.treatment_id
    WHERE at2.appointment_id = NEW.id
    GROUP BY tii.inventory_item_id;
  END IF;

  RETURN NEW;
END;
$$;
