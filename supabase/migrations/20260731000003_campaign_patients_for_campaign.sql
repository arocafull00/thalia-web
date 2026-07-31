-- Destinatarios de una campaña ya guardada (issue #31, fase D)
--
-- campaign_segment_patients recibe los filtros sueltos porque el editor necesita
-- contar antes de que exista la campaña. Al enviar, en cambio, los filtros ya
-- están en campaign_segments, y traducirlos en la edge function significaría
-- reescribir en Deno el mapeo que ya existe en TypeScript. Esta función lo hace
-- en SQL para que el envío no dependa de ninguna copia de esa lógica.

CREATE OR REPLACE FUNCTION campaign_patients_for_campaign(p_campaign_id UUID)
RETURNS TABLE (
  id UUID,
  full_name TEXT,
  phone TEXT,
  visit_count BIGINT,
  last_visit_at TIMESTAMPTZ
)
LANGUAGE plpgsql
STABLE
SET search_path = public
AS $$
DECLARE
  v_clinic_id UUID;
  v_treatment_id UUID;
  v_min_visits INT;
  v_max_visits INT;
  v_months INT;
  v_min_age INT;
  v_max_age INT;
BEGIN
  SELECT c.clinic_id INTO v_clinic_id
  FROM campaigns c
  WHERE c.id = p_campaign_id;

  -- Campaña inexistente o invisible para quien llama: sin destinatarios.
  IF v_clinic_id IS NULL THEN
    RETURN;
  END IF;

  SELECT (s.config ->> 'treatment_id')::UUID INTO v_treatment_id
  FROM campaign_segments s
  WHERE s.campaign_id = p_campaign_id AND s.segment_type = 'treatment_type'
  LIMIT 1;

  SELECT
    (s.config ->> 'min_visits')::INT,
    (s.config ->> 'max_visits')::INT
  INTO v_min_visits, v_max_visits
  FROM campaign_segments s
  WHERE s.campaign_id = p_campaign_id AND s.segment_type = 'visit_count'
  LIMIT 1;

  SELECT (s.config ->> 'months_since_last_visit')::INT INTO v_months
  FROM campaign_segments s
  WHERE s.campaign_id = p_campaign_id AND s.segment_type = 'last_visit_date'
  LIMIT 1;

  SELECT
    (s.config ->> 'min_age')::INT,
    (s.config ->> 'max_age')::INT
  INTO v_min_age, v_max_age
  FROM campaign_segments s
  WHERE s.campaign_id = p_campaign_id AND s.segment_type = 'age_range'
  LIMIT 1;

  RETURN QUERY
  SELECT *
  FROM campaign_segment_patients(
    v_clinic_id,
    v_treatment_id,
    v_min_visits,
    v_max_visits,
    v_months,
    v_min_age,
    v_max_age
  );
END;
$$;

-- SECURITY INVOKER: al llamarla desde la app se aplica el RLS de campaigns y
-- patients. La edge function usa service role y se salta RLS, pero solo puede
-- resolver la campaña cuyo id recibe.

GRANT EXECUTE ON FUNCTION campaign_patients_for_campaign(UUID)
  TO authenticated, service_role;
