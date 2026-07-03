CREATE TABLE appointment_inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  inventory_item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
  quantity NUMERIC(10,2) NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (appointment_id, inventory_item_id)
);

CREATE INDEX idx_appointment_inventory_items_appointment ON appointment_inventory_items (appointment_id);
CREATE INDEX idx_appointment_inventory_items_item ON appointment_inventory_items (inventory_item_id);

ALTER TABLE appointment_inventory_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY appointment_inventory_items_select_same_clinic ON appointment_inventory_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_inventory_items.appointment_id
      AND appointments.clinic_id = current_employee_clinic_id()
    )
  );

CREATE POLICY appointment_inventory_items_write_allowed_roles ON appointment_inventory_items
  FOR ALL USING (
    current_employee_role() IN ('admin', 'reception', 'auxiliary')
    AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_inventory_items.appointment_id
      AND appointments.clinic_id = current_employee_clinic_id()
    )
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = appointment_inventory_items.inventory_item_id
      AND inventory_items.clinic_id = current_employee_clinic_id()
    )
  )
  WITH CHECK (
    current_employee_role() IN ('admin', 'reception', 'auxiliary')
    AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_inventory_items.appointment_id
      AND appointments.clinic_id = current_employee_clinic_id()
    )
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = appointment_inventory_items.inventory_item_id
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

CREATE TRIGGER appointments_completed_deduct_inventory
  AFTER UPDATE OF status ON appointments
  FOR EACH ROW EXECUTE FUNCTION handle_appointment_completed();
