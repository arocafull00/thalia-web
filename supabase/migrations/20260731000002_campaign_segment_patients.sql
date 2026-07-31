-- Segmentación de pacientes para campañas de marketing (issue #31, fase B)
--
-- La lógica vive en SQL y no en TypeScript porque la consumen dos sitios: la
-- app (vista previa del tamaño del segmento) y la edge function send-campaign
-- en Deno (materializar destinatarios). Duplicarla garantizaría divergencia.
--
-- Los filtros se combinan con AND. Un parámetro NULL significa "no filtrar por
-- esto". La combinación OR arbitraria queda fuera de alcance.

CREATE OR REPLACE FUNCTION campaign_segment_patients(
  p_clinic_id UUID,
  p_treatment_id UUID DEFAULT NULL,
  p_min_visits INT DEFAULT NULL,
  p_max_visits INT DEFAULT NULL,
  p_months_since_last_visit INT DEFAULT NULL,
  p_min_age INT DEFAULT NULL,
  p_max_age INT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  phone TEXT,
  visit_count BIGINT,
  last_visit_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SET search_path = public
AS $$
  WITH visits AS (
    -- Una "visita" es una cita completada. Las canceladas, los no_show y las
    -- futuras no cuentan: para reactivar a alguien importa si vino de verdad.
    SELECT
      a.patient_id,
      count(*) AS visit_count,
      max(a.starts_at) AS last_visit_at
    FROM appointments a
    WHERE a.clinic_id = p_clinic_id
      AND a.status = 'completed'
    GROUP BY a.patient_id
  )
  SELECT
    p.id,
    p.full_name,
    p.phone,
    coalesce(v.visit_count, 0) AS visit_count,
    v.last_visit_at
  FROM patients p
  LEFT JOIN visits v ON v.patient_id = p.id
  WHERE p.clinic_id = p_clinic_id
    -- Guardas no negociables. Sin consentimiento explícito no hay envío
    -- (LOPDGDD/LSSI), y sin teléfono no hay a dónde enviar.
    AND p.marketing_opt_in = true
    AND p.phone IS NOT NULL
    AND btrim(p.phone) <> ''
    -- Recibió un tratamiento concreto
    AND (
      p_treatment_id IS NULL
      OR EXISTS (
        SELECT 1
        FROM appointments a2
        JOIN appointment_treatments at2 ON at2.appointment_id = a2.id
        WHERE a2.patient_id = p.id
          AND a2.clinic_id = p_clinic_id
          AND a2.status = 'completed'
          AND at2.treatment_id = p_treatment_id
      )
    )
    -- Número de visitas
    AND (p_min_visits IS NULL OR coalesce(v.visit_count, 0) >= p_min_visits)
    AND (p_max_visits IS NULL OR coalesce(v.visit_count, 0) <= p_max_visits)
    -- Hace más de N meses que no viene. Quien no ha venido nunca queda fuera:
    -- "no viene desde hace 6 meses" presupone que vino alguna vez.
    AND (
      p_months_since_last_visit IS NULL
      OR (
        v.last_visit_at IS NOT NULL
        AND v.last_visit_at < now() - make_interval(months => p_months_since_last_visit)
      )
    )
    -- Franja de edad
    AND (
      p_min_age IS NULL
      OR (
        p.birth_date IS NOT NULL
        AND date_part('year', age(p.birth_date::timestamptz)) >= p_min_age
      )
    )
    AND (
      p_max_age IS NULL
      OR (
        p.birth_date IS NOT NULL
        AND date_part('year', age(p.birth_date::timestamptz)) <= p_max_age
      )
    )
  ORDER BY p.full_name;
$$;

-- SECURITY INVOKER (por defecto): al llamarla desde la app se aplica el RLS de
-- patients y appointments, así que un empleado no puede segmentar otra clínica
-- ni pasándole un p_clinic_id ajeno. La edge function usa service role y se
-- salta RLS, pero el filtro por p_clinic_id sigue acotándola.

GRANT EXECUTE ON FUNCTION campaign_segment_patients(
  UUID, UUID, INT, INT, INT, INT, INT
) TO authenticated, service_role;
