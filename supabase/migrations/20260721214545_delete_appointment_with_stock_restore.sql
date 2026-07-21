CREATE OR REPLACE FUNCTION delete_appointment(
  p_appointment_id UUID,
  p_restore_stock BOOLEAN DEFAULT FALSE
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_appointment appointments%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT *
  INTO target_appointment
  FROM appointments
  WHERE id = p_appointment_id
    AND clinic_id = current_employee_clinic_id()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment not found';
  END IF;

  IF current_employee_role() NOT IN ('admin', 'reception', 'doctor') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  IF p_restore_stock AND target_appointment.status = 'completed' THEN
    IF EXISTS (
      SELECT 1
      FROM appointment_inventory_items
      WHERE appointment_id = p_appointment_id
    ) THEN
      INSERT INTO inventory_movements (item_id, employee_id, type, quantity, notes)
      SELECT inventory_item_id, target_appointment.employee_id, 'in', quantity,
        'Reposición por cita eliminada'
      FROM appointment_inventory_items
      WHERE appointment_id = p_appointment_id;
    ELSE
      INSERT INTO inventory_movements (item_id, employee_id, type, quantity, notes)
      SELECT treatment_inventory_items.inventory_item_id,
        target_appointment.employee_id,
        'in',
        SUM(treatment_inventory_items.quantity),
        'Reposición por cita eliminada'
      FROM appointment_treatments
      JOIN treatment_inventory_items
        ON treatment_inventory_items.treatment_id = appointment_treatments.treatment_id
      WHERE appointment_treatments.appointment_id = p_appointment_id
      GROUP BY treatment_inventory_items.inventory_item_id;
    END IF;
  END IF;

  DELETE FROM appointment_inventory_items
  WHERE appointment_id = p_appointment_id;

  DELETE FROM appointment_treatments
  WHERE appointment_id = p_appointment_id;

  DELETE FROM appointments
  WHERE id = p_appointment_id;
END;
$$;

REVOKE ALL ON FUNCTION delete_appointment(UUID, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION delete_appointment(UUID, BOOLEAN) TO authenticated;
