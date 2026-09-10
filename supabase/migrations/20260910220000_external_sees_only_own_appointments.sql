-- El autónomo sólo ve sus propias citas (issue #99)
--
-- Hasta ahora `appointments_select_same_clinic` filtraba sólo por clínica, así
-- que un profesional externo veía la agenda entera: con quién trabaja el resto
-- del equipo, a qué hora y con qué paciente.
--
-- Va en RLS por lo mismo que #102: ningún DAL de citas usa service role, así que
-- una política corrige a la vez el listado, el recuento, la agenda, el detalle,
-- la vista `appointments_search` —que es `security_invoker`— y cualquier llamada
-- directa a la API con el JWT del usuario. Fijar `employee_id` en los hooks,
-- como proponía la issue, sólo lo escondería en la interfaz.
--
-- Aquí no hace falta la corrección que sí necesitó `patients`: las políticas de
-- citas ya están separadas por comando (SELECT, INSERT, UPDATE) y ninguna es
-- FOR ALL, así que acotar la de lectura basta para la visibilidad.

DROP POLICY IF EXISTS appointments_select_same_clinic ON appointments;

CREATE POLICY appointments_select_same_clinic
  ON appointments FOR SELECT
  USING (
    clinic_id = current_employee_clinic_id()
    AND (
      current_membership_role() IS DISTINCT FROM 'external'
      OR employee_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- Edición: que no pueda tocar a ciegas lo que no ve
-- ---------------------------------------------------------------------------
--
-- Sin esto quedaría una incoherencia: el autónomo no vería las citas ajenas
-- pero podría modificarlas conociendo el id, porque la política de UPDATE sólo
-- mira la profesión —y un autónomo suele ser 'doctor'—.
--
-- No se le bloquea la edición por completo, sólo se acota a las suyas: los
-- autónomos van a operar sobre su propia agenda (#89).

DROP POLICY IF EXISTS appointments_update_allowed_roles ON appointments;

CREATE POLICY appointments_update_allowed_roles
  ON appointments FOR UPDATE
  USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
    AND (
      current_membership_role() IS DISTINCT FROM 'external'
      OR employee_id = auth.uid()
    )
  )
  WITH CHECK (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() IN ('admin', 'reception', 'doctor')
    AND (
      current_membership_role() IS DISTINCT FROM 'external'
      OR employee_id = auth.uid()
    )
  );

-- El EXISTS de la política de `patients` (#102) consulta esta tabla y, por
-- tanto, pasa por la política de arriba. No hay recursión —ninguna de estas dos
-- menciona `patients`— y el resultado no cambia: aquel EXISTS ya filtraba por
-- `employee_id = auth.uid()`, que es justo lo que el autónomo puede ver.
CREATE INDEX IF NOT EXISTS idx_appointments_employee_clinic
  ON appointments (employee_id, clinic_id);
