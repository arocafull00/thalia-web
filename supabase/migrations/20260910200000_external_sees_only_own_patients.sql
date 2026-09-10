-- El autónomo sólo ve los pacientes de sus propias citas (issue #102)
--
-- Hasta ahora `patients_select_same_clinic` filtraba únicamente por clínica, así
-- que un profesional externo veía el censo completo de pacientes: nombres,
-- teléfonos y fechas de nacimiento de gente que no ha tratado nunca.
--
-- El arreglo va en RLS y no en el DAL. Ningún DAL de pacientes usa service role
-- —tanto el cliente de navegador como el de servidor viajan con la identidad
-- del usuario—, así que la política corrige a la vez el listado, el recuento
-- `count: exact`, la búsqueda, el detalle y cualquier llamada directa a la API
-- con el JWT del usuario. Filtrarlo en el DAL sería cosmético: bastaría con
-- consultar PostgREST por fuera de la aplicación para saltárselo.

-- ---------------------------------------------------------------------------
-- El rol de membresía no era accesible desde SQL
-- ---------------------------------------------------------------------------
--
-- Ojo con la que ya existía: `current_employee_role()` devuelve `employees.role`
-- —admin, reception, doctor, auxiliary—, que es la profesión. "external" es otra
-- cosa: vive en `clinic_memberships.role` y describe la relación con la clínica.
-- Un autónomo es external Y probablemente doctor a la vez.

CREATE OR REPLACE FUNCTION current_membership_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM clinic_memberships
  WHERE user_id = auth.uid()
    AND clinic_id = current_employee_clinic_id()
    AND status = 'active'
  LIMIT 1
$$;

GRANT EXECUTE ON FUNCTION current_membership_role() TO authenticated, service_role;

-- El EXISTS de abajo se ejecuta por cada fila candidata del listado. Sin este
-- índice compuesto obligaría a filtrar por patient_id sobre todas las citas del
-- profesional.
CREATE INDEX IF NOT EXISTS idx_appointments_employee_patient
  ON appointments (employee_id, patient_id);

-- ---------------------------------------------------------------------------
-- Lectura
-- ---------------------------------------------------------------------------
--
-- `IS DISTINCT FROM` y no `<> 'external'`: si la función devolviera NULL, la
-- comparación normal daría NULL y la política denegaría en silencio a todo el
-- personal de la clínica. Se prefiere que un rol no resuelto conserve el
-- comportamiento de antes —ver todo— porque quien no tiene membresía activa ni
-- siquiera pasa del layout de la aplicación, y bloquear por un fallo de lectura
-- del rol dejaría a una clínica entera sin pacientes sin explicación.

DROP POLICY IF EXISTS patients_select_same_clinic ON patients;

CREATE POLICY patients_select_same_clinic
  ON patients FOR SELECT
  USING (
    clinic_id = current_employee_clinic_id()
    AND (
      current_membership_role() IS DISTINCT FROM 'external'
      OR EXISTS (
        SELECT 1 FROM appointments a
        WHERE a.patient_id = patients.id
          AND a.employee_id = auth.uid()
      )
    )
  );

-- ---------------------------------------------------------------------------
-- Escritura: la política que hacía inútil todo lo anterior
-- ---------------------------------------------------------------------------
--
-- `patients_write_allowed_roles` es FOR ALL y permissive. En PostgreSQL FOR ALL
-- cubre también SELECT, y las políticas permisivas se combinan con OR: un
-- autónomo cuyo `employees.role` fuese 'doctor' seguiría viendo el censo entero
-- por esta vía, por mucho que se acotase la política de lectura.
--
-- Excluir a external de aquí es además lo que corresponde: para el autónomo los
-- pacientes son de sólo lectura (#101).

DROP POLICY IF EXISTS patients_write_allowed_roles ON patients;

CREATE POLICY patients_write_allowed_roles
  ON patients FOR ALL
  USING (
    clinic_id = current_employee_clinic_id()
    AND current_employee_role() = ANY (ARRAY['admin', 'reception', 'doctor'])
    AND current_membership_role() IS DISTINCT FROM 'external'
  );
