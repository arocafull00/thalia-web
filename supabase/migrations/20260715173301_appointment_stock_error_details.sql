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
    SELECT inventory_item_id
    FROM appointment_inventory_items
    WHERE appointment_id = NEW.id
    UNION
    SELECT treatment_material.inventory_item_id
    FROM appointment_treatments appointment_treatment
    JOIN treatment_inventory_items treatment_material
      ON treatment_material.treatment_id = appointment_treatment.treatment_id
    WHERE appointment_treatment.appointment_id = NEW.id
  )
  FOR UPDATE;

  WITH effective_materials AS (
    SELECT inventory_item_id, SUM(quantity) AS required_quantity
    FROM appointment_inventory_items
    WHERE appointment_id = NEW.id
    GROUP BY inventory_item_id
    UNION ALL
    SELECT treatment_material.inventory_item_id, SUM(treatment_material.quantity)
    FROM appointment_treatments appointment_treatment
    JOIN treatment_inventory_items treatment_material
      ON treatment_material.treatment_id = appointment_treatment.treatment_id
    WHERE appointment_treatment.appointment_id = NEW.id
      AND NOT EXISTS (
        SELECT 1
        FROM appointment_inventory_items
        WHERE appointment_id = NEW.id
      )
    GROUP BY treatment_material.inventory_item_id
  ), shortages AS (
    SELECT
      inventory.id AS inventory_item_id,
      inventory.name AS item_name,
      inventory.unit,
      COALESCE(inventory.stock, 0) AS available_stock,
      material.required_quantity,
      material.required_quantity - COALESCE(inventory.stock, 0) AS deficit,
      COUNT(*) OVER () AS shortage_count
    FROM effective_materials material
    JOIN inventory_items inventory ON inventory.id = material.inventory_item_id
    WHERE COALESCE(inventory.stock, 0) < material.required_quantity
  )
  SELECT *
  INTO shortage
  FROM shortages
  ORDER BY deficit DESC, inventory_item_id
  LIMIT 1;

  IF FOUND THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'Stock insuficiente para completar la cita.',
      DETAIL = json_build_object(
        'kind', 'appointment_stock_shortage',
        'inventoryItemId', shortage.inventory_item_id,
        'itemName', shortage.item_name,
        'availableStock', shortage.available_stock,
        'requiredQuantity', shortage.required_quantity,
        'unit', shortage.unit,
        'shortageCount', shortage.shortage_count
      )::text;
  END IF;

  RETURN NEW;
END;
$$;
