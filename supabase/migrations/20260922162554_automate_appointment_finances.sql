CREATE TYPE public.transaction_category_system_key AS ENUM (
  'appointment_treatments',
  'appointment_materials'
);

ALTER TABLE public.transaction_categories
  ADD COLUMN system_key public.transaction_category_system_key;

UPDATE public.transaction_categories
SET system_key = CASE
  WHEN type = 'income' AND lower(name) = lower('Tratamientos')
    THEN 'appointment_treatments'::public.transaction_category_system_key
  WHEN type = 'expense' AND lower(name) = lower('Material sanitario')
    THEN 'appointment_materials'::public.transaction_category_system_key
END
WHERE
  (type = 'income' AND lower(name) = lower('Tratamientos'))
  OR (type = 'expense' AND lower(name) = lower('Material sanitario'));

INSERT INTO public.transaction_categories (clinic_id, type, name, system_key)
SELECT
  clinic.id,
  defaults.type,
  defaults.name,
  defaults.system_key
FROM public.clinics clinic
CROSS JOIN (
  VALUES
    (
      'income'::public.transaction_type,
      'Tratamientos',
      'appointment_treatments'::public.transaction_category_system_key
    ),
    (
      'expense'::public.transaction_type,
      'Material sanitario',
      'appointment_materials'::public.transaction_category_system_key
    )
) AS defaults(type, name, system_key)
WHERE NOT EXISTS (
  SELECT 1
  FROM public.transaction_categories category
  WHERE category.clinic_id = clinic.id
    AND category.system_key = defaults.system_key
);

CREATE UNIQUE INDEX transaction_categories_clinic_system_key_unique
  ON public.transaction_categories (clinic_id, system_key)
  WHERE system_key IS NOT NULL;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM public.transactions
    WHERE appointment_id IS NOT NULL
    GROUP BY appointment_id, type
    HAVING COUNT(*) > 1
  ) THEN
    RAISE EXCEPTION 'Duplicate appointment transactions must be reconciled before applying this migration';
  END IF;
END;
$$;

CREATE UNIQUE INDEX transactions_appointment_type_unique
  ON public.transactions (appointment_id, type)
  WHERE appointment_id IS NOT NULL;

CREATE OR REPLACE FUNCTION public.seed_default_transaction_categories()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.transaction_categories (clinic_id, type, name, system_key)
  VALUES
    (
      NEW.id,
      'income'::public.transaction_type,
      'Tratamientos',
      'appointment_treatments'::public.transaction_category_system_key
    ),
    (NEW.id, 'income'::public.transaction_type, 'Productos', NULL),
    (NEW.id, 'expense'::public.transaction_type, 'Nóminas', NULL),
    (NEW.id, 'expense'::public.transaction_type, 'Alquiler', NULL),
    (NEW.id, 'expense'::public.transaction_type, 'Marketing', NULL),
    (
      NEW.id,
      'expense'::public.transaction_type,
      'Material sanitario',
      'appointment_materials'::public.transaction_category_system_key
    )
  ON CONFLICT (clinic_id, type, (lower(name))) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER appointments_completed_deduct_inventory
  ON public.appointments;

DROP FUNCTION IF EXISTS public.handle_appointment_completed();

DROP TRIGGER inventory_alert_trigger
  ON public.inventory_items;

DROP FUNCTION public.handle_inventory_alert();

CREATE FUNCTION private.handle_inventory_alert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF (NEW.stock - NEW.min_stock) < 10 THEN
    INSERT INTO public.inventory_alerts (
      clinic_id,
      inventory_item_id,
      item_name,
      stock,
      min_stock
    )
    VALUES (NEW.clinic_id, NEW.id, NEW.name, NEW.stock, NEW.min_stock)
    ON CONFLICT (inventory_item_id) WHERE resolved_at IS NULL
    DO UPDATE SET
      stock = EXCLUDED.stock,
      min_stock = EXCLUDED.min_stock,
      item_name = EXCLUDED.item_name;
  ELSE
    UPDATE public.inventory_alerts
    SET resolved_at = now()
    WHERE inventory_item_id = NEW.id
      AND resolved_at IS NULL;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.handle_inventory_alert()
  FROM PUBLIC, anon, authenticated;

CREATE TRIGGER inventory_alert_trigger
  AFTER INSERT OR UPDATE OF stock, min_stock ON public.inventory_items
  FOR EACH ROW EXECUTE FUNCTION private.handle_inventory_alert();

CREATE OR REPLACE FUNCTION public.update_inventory_stock()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.inventory_items
  SET stock = stock + CASE
    WHEN NEW.type = 'in' THEN NEW.quantity
    WHEN NEW.type = 'out' THEN -NEW.quantity
    WHEN NEW.type = 'adjustment' THEN NEW.quantity
  END
  WHERE id = NEW.item_id;

  RETURN NEW;
END;
$$;

CREATE FUNCTION private.handle_appointment_completed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id UUID := COALESCE((SELECT auth.uid()), NEW.employee_id);
  appointment_date DATE;
  expense_amount NUMERIC;
  expense_category_id UUID;
  income_amount NUMERIC;
  income_category_id UUID;
  patient_name TEXT;
BEGIN
  IF NEW.status <> 'completed' OR OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM public.appointment_inventory_items
    WHERE appointment_id = NEW.id
  ) THEN
    INSERT INTO public.inventory_movements (
      item_id,
      employee_id,
      type,
      quantity,
      notes
    )
    SELECT
      inventory_item_id,
      NEW.employee_id,
      'out'::public.inventory_movement_type,
      quantity,
      'Cita completada'
    FROM public.appointment_inventory_items
    WHERE appointment_id = NEW.id;
  ELSE
    INSERT INTO public.inventory_movements (
      item_id,
      employee_id,
      type,
      quantity,
      notes
    )
    SELECT
      treatment_material.inventory_item_id,
      NEW.employee_id,
      'out'::public.inventory_movement_type,
      SUM(treatment_material.quantity),
      'Cita completada'
    FROM public.appointment_treatments appointment_treatment
    JOIN public.treatment_inventory_items treatment_material
      ON treatment_material.treatment_id = appointment_treatment.treatment_id
    WHERE appointment_treatment.appointment_id = NEW.id
    GROUP BY treatment_material.inventory_item_id;
  END IF;

  SELECT
    (NEW.starts_at AT TIME ZONE COALESCE(clinic.timezone, 'Europe/Madrid'))::DATE,
    patient.full_name
  INTO appointment_date, patient_name
  FROM public.clinics clinic
  JOIN public.patients patient ON patient.id = NEW.patient_id
  WHERE clinic.id = NEW.clinic_id;

  SELECT category.id
  INTO income_category_id
  FROM public.transaction_categories category
  WHERE category.clinic_id = NEW.clinic_id
    AND category.type = 'income'::public.transaction_type
    AND category.system_key = 'appointment_treatments'::public.transaction_category_system_key;

  SELECT category.id
  INTO expense_category_id
  FROM public.transaction_categories category
  WHERE category.clinic_id = NEW.clinic_id
    AND category.type = 'expense'::public.transaction_type
    AND category.system_key = 'appointment_materials'::public.transaction_category_system_key;

  IF income_category_id IS NULL OR expense_category_id IS NULL THEN
    RAISE EXCEPTION 'Automatic transaction categories are not configured for clinic %', NEW.clinic_id;
  END IF;

  SELECT COALESCE(SUM(price.price_at_booking), 0)
  INTO income_amount
  FROM public.appointment_treatments appointment_treatment
  JOIN public.appointment_treatment_prices price
    ON price.appointment_treatment_id = appointment_treatment.id
  WHERE appointment_treatment.appointment_id = NEW.id;

  WITH effective_materials AS (
    SELECT
      appointment_material.inventory_item_id,
      SUM(appointment_material.quantity) AS quantity
    FROM public.appointment_inventory_items appointment_material
    WHERE appointment_material.appointment_id = NEW.id
    GROUP BY appointment_material.inventory_item_id

    UNION ALL

    SELECT
      treatment_material.inventory_item_id,
      SUM(treatment_material.quantity) AS quantity
    FROM public.appointment_treatments appointment_treatment
    JOIN public.treatment_inventory_items treatment_material
      ON treatment_material.treatment_id = appointment_treatment.treatment_id
    WHERE appointment_treatment.appointment_id = NEW.id
      AND NOT EXISTS (
        SELECT 1
        FROM public.appointment_inventory_items
        WHERE appointment_id = NEW.id
      )
    GROUP BY treatment_material.inventory_item_id
  )
  SELECT COALESCE(ROUND(SUM(material.quantity * inventory.unit_price), 2), 0)
  INTO expense_amount
  FROM effective_materials material
  JOIN public.inventory_items inventory
    ON inventory.id = material.inventory_item_id
  WHERE inventory.unit_price IS NOT NULL;

  IF income_amount > 0 THEN
    INSERT INTO public.transactions (
      clinic_id,
      appointment_id,
      type,
      category_id,
      amount,
      description,
      date,
      created_by
    )
    VALUES (
      NEW.clinic_id,
      NEW.id,
      'income'::public.transaction_type,
      income_category_id,
      income_amount,
      concat('Cobro por tratamientos · ', patient_name),
      appointment_date,
      actor_id
    )
    ON CONFLICT (appointment_id, type) WHERE appointment_id IS NOT NULL
    DO UPDATE SET
      clinic_id = EXCLUDED.clinic_id,
      category_id = EXCLUDED.category_id,
      amount = EXCLUDED.amount,
      description = EXCLUDED.description,
      date = EXCLUDED.date;
  ELSE
    DELETE FROM public.transactions
    WHERE appointment_id = NEW.id
      AND type = 'income'::public.transaction_type;
  END IF;

  IF expense_amount > 0 THEN
    INSERT INTO public.transactions (
      clinic_id,
      appointment_id,
      type,
      category_id,
      amount,
      description,
      date,
      created_by
    )
    VALUES (
      NEW.clinic_id,
      NEW.id,
      'expense'::public.transaction_type,
      expense_category_id,
      expense_amount,
      concat('Coste de materiales · ', patient_name),
      appointment_date,
      actor_id
    )
    ON CONFLICT (appointment_id, type) WHERE appointment_id IS NOT NULL
    DO UPDATE SET
      clinic_id = EXCLUDED.clinic_id,
      category_id = EXCLUDED.category_id,
      amount = EXCLUDED.amount,
      description = EXCLUDED.description,
      date = EXCLUDED.date;
  ELSE
    DELETE FROM public.transactions
    WHERE appointment_id = NEW.id
      AND type = 'expense'::public.transaction_type;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION private.handle_appointment_completed()
  FROM PUBLIC, anon, authenticated;

CREATE TRIGGER appointments_completed_deduct_inventory
  AFTER UPDATE OF status ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION private.handle_appointment_completed();

GRANT USAGE ON TYPE public.transaction_category_system_key
  TO anon, authenticated, service_role;
