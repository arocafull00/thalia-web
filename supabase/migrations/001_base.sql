CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE clinics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER clinics_updated_at BEFORE UPDATE ON clinics
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE employees (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','reception','doctor','auxiliary')),
  specialty TEXT,
  color TEXT,
  avatar_url TEXT,
  phone TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER employees_updated_at BEFORE UPDATE ON employees
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  full_name TEXT NOT NULL,
  dni TEXT,
  birth_date DATE,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE treatment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 30,
  color TEXT,
  price NUMERIC(10,2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER treatment_types_updated_at BEFORE UPDATE ON treatment_types
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE RESTRICT,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled'
    CHECK (status IN ('scheduled','confirmed','in_progress','completed','cancelled','no_show')),
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE appointment_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
  treatment_type_id UUID NOT NULL REFERENCES treatment_types(id) ON DELETE RESTRICT,
  price_at_booking NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  category TEXT,
  unit TEXT,
  stock NUMERIC(10,2) DEFAULT 0,
  min_stock NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER inventory_items_updated_at BEFORE UPDATE ON inventory_items
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE inventory_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES inventory_items(id) ON DELETE RESTRICT,
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  type TEXT NOT NULL CHECK (type IN ('in','out','adjustment')),
  quantity NUMERIC(10,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE OR REPLACE FUNCTION update_inventory_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE inventory_items
  SET stock = stock + CASE
    WHEN NEW.type = 'in' THEN NEW.quantity
    WHEN NEW.type = 'out' THEN -NEW.quantity
    WHEN NEW.type = 'adjustment' THEN NEW.quantity
  END
  WHERE id = NEW.item_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER inventory_movements_update_stock
  AFTER INSERT ON inventory_movements
  FOR EACH ROW EXECUTE FUNCTION update_inventory_stock();

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES clinics(id) ON DELETE RESTRICT,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('income','expense')),
  category TEXT,
  amount NUMERIC(10,2) NOT NULL,
  description TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_by UUID NOT NULL REFERENCES employees(id) ON DELETE RESTRICT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE INDEX idx_appointments_starts_at ON appointments (starts_at);
CREATE INDEX idx_appointments_employee_id ON appointments (employee_id);
CREATE INDEX idx_appointments_patient_id ON appointments (patient_id);
CREATE INDEX idx_appointments_clinic_starts ON appointments (clinic_id, starts_at);
CREATE INDEX idx_patients_full_name ON patients (full_name);
CREATE INDEX idx_patients_clinic_id ON patients (clinic_id);
CREATE INDEX idx_appointment_treatments_appointment ON appointment_treatments (appointment_id);
CREATE INDEX idx_inventory_items_clinic_id ON inventory_items (clinic_id);
CREATE INDEX idx_transactions_clinic_date ON transactions (clinic_id, date);

CREATE OR REPLACE FUNCTION current_employee_clinic_id()
RETURNS UUID
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT clinic_id FROM employees WHERE id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION current_employee_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM employees WHERE id = auth.uid()
$$;

ALTER TABLE clinics ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE treatment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY clinics_select_same_clinic ON clinics
  FOR SELECT USING (id = current_employee_clinic_id());

CREATE POLICY employees_select_same_clinic ON employees
  FOR SELECT USING (clinic_id = current_employee_clinic_id());

CREATE POLICY employees_admin_insert ON employees
  FOR INSERT WITH CHECK (current_employee_role() = 'admin' AND clinic_id = current_employee_clinic_id());

CREATE POLICY employees_admin_update ON employees
  FOR UPDATE USING (current_employee_role() = 'admin' AND clinic_id = current_employee_clinic_id())
  WITH CHECK (current_employee_role() = 'admin' AND clinic_id = current_employee_clinic_id());

CREATE POLICY patients_select_same_clinic ON patients
  FOR SELECT USING (clinic_id = current_employee_clinic_id());

CREATE POLICY patients_write_allowed_roles ON patients
  FOR ALL USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception','doctor')
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception','doctor')
  );

CREATE POLICY treatment_types_same_clinic ON treatment_types
  FOR ALL USING (clinic_id = current_employee_clinic_id())
  WITH CHECK (clinic_id = current_employee_clinic_id());

CREATE POLICY appointments_select_same_clinic ON appointments
  FOR SELECT USING (clinic_id = current_employee_clinic_id());

CREATE POLICY appointments_create_edit_allowed_roles ON appointments
  FOR INSERT WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception','doctor')
  );

CREATE POLICY appointments_update_allowed_roles ON appointments
  FOR UPDATE USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception','doctor')
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception','doctor')
  );

CREATE POLICY appointment_treatments_select_same_clinic ON appointment_treatments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_treatments.appointment_id
      AND appointments.clinic_id = current_employee_clinic_id()
    )
  );

CREATE POLICY appointment_treatments_write_allowed_roles ON appointment_treatments
  FOR ALL USING (
    current_employee_role() IN ('admin','reception','doctor')
    AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_treatments.appointment_id
      AND appointments.clinic_id = current_employee_clinic_id()
    )
  )
  WITH CHECK (
    current_employee_role() IN ('admin','reception','doctor')
    AND EXISTS (
      SELECT 1 FROM appointments
      WHERE appointments.id = appointment_treatments.appointment_id
      AND appointments.clinic_id = current_employee_clinic_id()
    )
  );

CREATE POLICY inventory_items_select_same_clinic ON inventory_items
  FOR SELECT USING (clinic_id = current_employee_clinic_id());

CREATE POLICY inventory_items_write_allowed_roles ON inventory_items
  FOR ALL USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception','auxiliary')
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin','reception','auxiliary')
  );

CREATE POLICY inventory_movements_select_same_clinic ON inventory_movements
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = inventory_movements.item_id
      AND inventory_items.clinic_id = current_employee_clinic_id()
    )
  );

CREATE POLICY inventory_movements_insert_allowed_roles ON inventory_movements
  FOR INSERT WITH CHECK (
    current_employee_role() IN ('admin','reception','auxiliary')
    AND EXISTS (
      SELECT 1 FROM inventory_items
      WHERE inventory_items.id = inventory_movements.item_id
      AND inventory_items.clinic_id = current_employee_clinic_id()
    )
  );

CREATE POLICY transactions_admin_same_clinic ON transactions
  FOR ALL USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() = 'admin'
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() = 'admin'
  );

ALTER PUBLICATION supabase_realtime ADD TABLE appointments;
ALTER PUBLICATION supabase_realtime ADD TABLE appointment_treatments;
