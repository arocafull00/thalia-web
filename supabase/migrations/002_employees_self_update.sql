CREATE POLICY employees_self_update ON employees
  FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND clinic_id = (SELECT e.clinic_id FROM employees e WHERE e.id = auth.uid())
    AND role = (SELECT e.role FROM employees e WHERE e.id = auth.uid())
    AND active = (SELECT e.active FROM employees e WHERE e.id = auth.uid())
  );
