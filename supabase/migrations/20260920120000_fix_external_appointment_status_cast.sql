/*
 * Arregla la aceptación de citas por parte del profesional externo.
 *
 * `20260916165000_native_enum_types.sql` convirtió `appointments.status` de
 * TEXT a un enum nativo, pero no actualizó esta función. El CASE devuelve
 * `text` y la asignación a la columna falla:
 *
 *   ERROR: column "status" is of type public.appointment_status
 *          but expression is of type text
 *
 * El efecto era que **un autónomo no podía aceptar ni rechazar ninguna cita**:
 * se quedaba en `pending_external` para siempre. Y de ahí colgaban otras dos
 * cosas, porque tanto el recordatorio al paciente como la sincronización con
 * Google Calendar exigen que la cita esté aceptada — los dos se negaban a
 * actuar sobre una cita que nunca podía salir de ese estado.
 *
 * El cuerpo es el que había en producción; el único cambio es el cast.
 */

CREATE OR REPLACE FUNCTION public.respond_external_appointment(p_appointment_id uuid, p_clinic_id uuid, p_decision text, p_allow_overlap boolean, p_expected_updated_at timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
DECLARE
  actor_id UUID := (SELECT auth.uid());
  target public.appointments%ROWTYPE;
  updated_target public.appointments%ROWTYPE;
  conflict RECORD;
BEGIN
  IF actor_id IS NULL THEN
    RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'Debes iniciar sesión.';
  END IF;

  IF p_decision NOT IN ('accept', 'reject') THEN
    RAISE EXCEPTION USING ERRCODE = '22023', MESSAGE = 'Respuesta no válida.';
  END IF;

  IF NOT private.is_external_member(actor_id, p_clinic_id) THEN
    RAISE EXCEPTION USING
      ERRCODE = '42501',
      MESSAGE = 'No tienes acceso como profesional externo a esta clínica.';
  END IF;

  SELECT appointment.*
  INTO target
  FROM public.appointments appointment
  WHERE appointment.id = p_appointment_id
  FOR UPDATE;

  IF NOT FOUND
    OR target.clinic_id <> p_clinic_id
    OR target.employee_id <> actor_id
  THEN
    RAISE EXCEPTION USING ERRCODE = '42501', MESSAGE = 'No puedes responder esta cita.';
  END IF;

  IF target.status <> 'pending_external' THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'Esta solicitud ya no está pendiente.';
  END IF;

  IF target.updated_at IS DISTINCT FROM p_expected_updated_at THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'La cita ha cambiado. Revísala antes de responder.';
  END IF;

  IF p_decision = 'accept' THEN
    SELECT
      clinic.name AS clinic_name,
      appointment.starts_at,
      appointment.ends_at
    INTO conflict
    FROM public.appointments appointment
    JOIN public.clinics clinic ON clinic.id = appointment.clinic_id
    WHERE appointment.id <> target.id
      AND appointment.employee_id = actor_id
      AND appointment.status IN ('scheduled', 'confirmed', 'in_progress')
      AND appointment.starts_at < target.ends_at
      AND appointment.ends_at > target.starts_at
    ORDER BY appointment.starts_at, appointment.id
    LIMIT 1;

    IF FOUND AND NOT p_allow_overlap THEN
      RETURN jsonb_build_object(
        'outcome', 'overlap',
        'appointmentUpdatedAt', target.updated_at,
        'conflict', jsonb_build_object(
          'clinicName', conflict.clinic_name,
          'startsAt', conflict.starts_at,
          'endsAt', conflict.ends_at
        )
      );
    END IF;
  END IF;

  PERFORM set_config('thalia.external_appointment_response', 'authorized', true);

  UPDATE public.appointments
  SET status = (CASE
    WHEN p_decision = 'accept' THEN 'scheduled'
    ELSE 'rejected_external'
  END)::public.appointment_status
  WHERE id = target.id
  RETURNING * INTO updated_target;

  RETURN jsonb_build_object(
    'outcome', CASE WHEN p_decision = 'accept' THEN 'accepted' ELSE 'rejected' END,
    'appointment', to_jsonb(updated_target)
  );
END;
$function$;
