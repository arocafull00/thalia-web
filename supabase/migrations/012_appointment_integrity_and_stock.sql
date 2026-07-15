CREATE EXTENSION IF NOT EXISTS btree_gist;

WITH ranked AS (
  SELECT id, row_number() OVER (
    PARTITION BY clinic_id, employee_id, starts_at
    ORDER BY created_at, id
  ) AS row_number
  FROM appointments
)
DELETE FROM appointments
WHERE id IN (SELECT id FROM ranked WHERE row_number > 1);

UPDATE appointments AS candidate
SET status = 'cancelled'
WHERE candidate.status <> 'cancelled'
  AND EXISTS (
    SELECT 1
    FROM appointments AS existing
    WHERE existing.patient_id = candidate.patient_id
      AND existing.status <> 'cancelled'
      AND existing.starts_at < candidate.ends_at
      AND existing.ends_at > candidate.starts_at
      AND (existing.created_at, existing.id) < (candidate.created_at, candidate.id)
  );

ALTER TABLE appointments
  ADD CONSTRAINT appointments_clinic_employee_start_unique
  UNIQUE (clinic_id, employee_id, starts_at);

ALTER TABLE appointments
  ADD CONSTRAINT appointments_patient_time_no_overlap
  EXCLUDE USING gist (
    patient_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status <> 'cancelled');

CREATE OR REPLACE FUNCTION assert_appointment_inventory_available()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  shortage RECORD;
BEGIN
  IF NEW.status NOT IN ('confirmed', 'completed') OR OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  PERFORM 1
  FROM inventory_items
  WHERE id IN (
    SELECT inventory_item_id FROM appointment_inventory_items WHERE appointment_id = NEW.id
    UNION
    SELECT tii.inventory_item_id
    FROM appointment_treatments appointment_treatment
    JOIN treatment_inventory_items tii ON tii.treatment_id = appointment_treatment.treatment_id
    WHERE appointment_treatment.appointment_id = NEW.id
  )
  FOR UPDATE;

  SELECT material.inventory_item_id, material.required_quantity, inventory.stock
  INTO shortage
  FROM (
    SELECT inventory_item_id, SUM(quantity) AS required_quantity
    FROM appointment_inventory_items
    WHERE appointment_id = NEW.id
    GROUP BY inventory_item_id
    UNION ALL
    SELECT tii.inventory_item_id, SUM(tii.quantity)
    FROM appointment_treatments appointment_treatment
    JOIN treatment_inventory_items tii ON tii.treatment_id = appointment_treatment.treatment_id
    WHERE appointment_treatment.appointment_id = NEW.id
      AND NOT EXISTS (
        SELECT 1 FROM appointment_inventory_items WHERE appointment_id = NEW.id
      )
    GROUP BY tii.inventory_item_id
  ) material
  JOIN inventory_items inventory ON inventory.id = material.inventory_item_id
  WHERE inventory.stock < material.required_quantity
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'Stock insuficiente para completar la cita.';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER appointments_require_available_inventory
  BEFORE UPDATE OF status ON appointments
  FOR EACH ROW EXECUTE FUNCTION assert_appointment_inventory_available();
