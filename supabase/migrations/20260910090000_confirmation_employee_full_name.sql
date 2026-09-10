-- El profesional aparece con nombre y apellidos en la página de confirmación
--
-- La primera versión enseñaba sólo el nombre de pila, por prudencia con lo que
-- se expone en un enlace que viaja por WhatsApp. Para el profesional esa cautela
-- no aplica: es personal de la clínica y el paciente ya sabe con quién va, así
-- que el nombre completo informa mejor y no revela nada que no supiera.
--
-- Lo que sigue minimizado es el paciente: sólo el nombre de pila, y ni teléfono,
-- ni DNI, ni tratamiento.
--
-- Cambia el nombre de una columna del TABLE de retorno, y eso es un cambio de
-- firma: `CREATE OR REPLACE` no puede alterar el tipo de retorno, hay que borrar
-- y volver a crear. La migración va en una transacción, así que no existe un
-- instante en que la página encuentre la función a medias.

DROP FUNCTION IF EXISTS confirm_appointment_by_token(UUID);
DROP FUNCTION IF EXISTS get_appointment_confirmation(UUID);

CREATE FUNCTION get_appointment_confirmation(p_token UUID)
RETURNS TABLE (
  state TEXT,
  patient_first_name TEXT,
  clinic_name TEXT,
  clinic_phone TEXT,
  clinic_timezone TEXT,
  employee_name TEXT,
  starts_at TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    appointment_confirmation_state(a.status, a.starts_at, t.expires_at, t.confirmed_at),
    split_part(p.full_name, ' ', 1),
    c.name,
    c.phone,
    c.timezone,
    e.full_name,
    a.starts_at
  FROM appointment_confirmation_tokens t
  JOIN appointments a ON a.id = t.appointment_id
  JOIN clinics c ON c.id = a.clinic_id
  JOIN patients p ON p.id = a.patient_id
  JOIN employees e ON e.id = a.employee_id
  WHERE t.token = p_token;
$$;

CREATE FUNCTION confirm_appointment_by_token(p_token UUID)
RETURNS TABLE (
  state TEXT,
  patient_first_name TEXT,
  clinic_name TEXT,
  clinic_phone TEXT,
  clinic_timezone TEXT,
  employee_name TEXT,
  starts_at TIMESTAMPTZ
)
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_token appointment_confirmation_tokens%ROWTYPE;
  v_appointment appointments%ROWTYPE;
  v_state TEXT;
BEGIN
  -- FOR UPDATE serializa dos pulsaciones simultáneas del mismo enlace.
  SELECT * INTO v_token
  FROM appointment_confirmation_tokens
  WHERE token = p_token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  SELECT * INTO v_appointment
  FROM appointments
  WHERE id = v_token.appointment_id
  FOR UPDATE;

  v_state := appointment_confirmation_state(
    v_appointment.status, v_appointment.starts_at,
    v_token.expires_at, v_token.confirmed_at
  );

  IF v_state = 'confirmable' THEN
    UPDATE appointments
      SET status = 'confirmed', updated_at = now()
      WHERE id = v_appointment.id;

    UPDATE appointment_confirmation_tokens
      SET confirmed_at = now()
      WHERE id = v_token.id;
  END IF;

  RETURN QUERY SELECT * FROM get_appointment_confirmation(p_token);
END;
$$;

-- Los permisos no sobreviven a un DROP: hay que volver a concederlos.
REVOKE ALL ON FUNCTION get_appointment_confirmation(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION confirm_appointment_by_token(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_appointment_confirmation(UUID) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION confirm_appointment_by_token(UUID) TO anon, authenticated, service_role;
