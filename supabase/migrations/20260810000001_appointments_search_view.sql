-- Vista de apoyo para paginar el listado de citas en servidor.
--
-- El buscador de citas cruza tres tablas —nombre y teléfono del paciente, y
-- nombre del tratamiento—, y PostgREST no permite un OR entre columnas de
-- relaciones distintas. Hasta ahora eso se resolvía filtrando en cliente sobre
-- el array completo, lo que impide paginar: con paginación en servidor pedirías
-- 20 filas y mostrarías 6.
--
-- La vista aplana los tres campos en una sola columna buscable. Sobre ella se
-- filtra y se pagina con .range() como si fuera una tabla.
--
-- Sólo expone las columnas necesarias para filtrar, ordenar y paginar. El
-- payload completo se sigue leyendo de `appointments` con su select anidado:
-- una vista no tiene claves foráneas y PostgREST no puede embeber relaciones
-- desde ella.

CREATE OR REPLACE VIEW appointments_search
WITH (security_invoker = true) AS
  SELECT
    a.id,
    a.clinic_id,
    a.employee_id,
    a.starts_at,
    a.status,
    lower(
      concat_ws(
        ' ',
        p.full_name,
        p.phone,
        string_agg(t.name, ' ')
      )
    ) AS search_text
  FROM appointments a
  LEFT JOIN patients p ON p.id = a.patient_id
  LEFT JOIN appointment_treatments att ON att.appointment_id = a.id
  LEFT JOIN treatment t ON t.id = att.treatment_id
  GROUP BY
    a.id,
    a.clinic_id,
    a.employee_id,
    a.starts_at,
    a.status,
    p.full_name,
    p.phone;

-- security_invoker: sin esto la vista se ejecutaría con los permisos de su
-- propietario y se saltaría el RLS de appointments y patients, dejando ver
-- citas de otras clínicas. Con la opción activada se aplican las políticas de
-- las tablas subyacentes, así que la vista no necesita políticas propias.

GRANT SELECT ON appointments_search TO authenticated, service_role;
