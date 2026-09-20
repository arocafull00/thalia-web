/*
 * Un profesional externo deja de poder escribir sobre las citas.
 *
 * Decisión de producto: un autónomo acepta o rechaza los huecos que le propone
 * la clínica, y nada más. Para mover o anular una cita ya aceptada habla con la
 * clínica y lo hace el personal interno. Más adelante habrá un sistema de
 * solicitud de aplazamiento o baja.
 *
 * Además cierra un agujero real. `delete_appointment` es SECURITY DEFINER y
 * comprobaba el rol, no el tipo de cuenta: un autónomo tiene `role = 'doctor'`,
 * que es lo natural para un profesional sanitario, así que pasaba el filtro. Y
 * como la función se salta la RLS, buscaba la cita por identificador sin mirar
 * de quién era. Verificado: **podía borrar la cita de otro profesional de su
 * clínica**, sin error y sin rastro.
 *
 * Lo que un externo conserva es aceptar y rechazar, que va por
 * `respond_external_appointment` — SECURITY DEFINER, con sus propias
 * comprobaciones, y por tanto ajena a estas políticas.
 */

-- ---------------------------------------------------------------------------
-- 1. Borrado: comprobar el tipo de cuenta, no solo el rol
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.delete_appointment(p_appointment_id uuid, p_restore_stock boolean DEFAULT false)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  target_appointment appointments%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT *
  INTO target_appointment
  FROM appointments
  WHERE id = p_appointment_id
    AND clinic_id = current_employee_clinic_id()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Appointment not found';
  END IF;

  /*
   * El rol no basta: un autónomo tiene `role = 'doctor'`, que es lo natural
   * para un profesional sanitario, y esta función es SECURITY DEFINER, así que
   * la RLS que solo le deja ver sus propias citas no interviene. Sin esta
   * comprobación podía borrar la cita de cualquier compañero de la clínica
   * conociendo su identificador.
   */
  IF private.is_external_user() THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  IF current_employee_role() NOT IN ('admin', 'reception', 'doctor') THEN
    RAISE EXCEPTION 'Insufficient permissions';
  END IF;

  IF p_restore_stock AND target_appointment.status = 'completed' THEN
    IF EXISTS (
      SELECT 1
      FROM appointment_inventory_items
      WHERE appointment_id = p_appointment_id
    ) THEN
      INSERT INTO inventory_movements (item_id, employee_id, type, quantity, notes)
      SELECT inventory_item_id, target_appointment.employee_id, 'in', quantity,
        'Reposición por cita eliminada'
      FROM appointment_inventory_items
      WHERE appointment_id = p_appointment_id;
    ELSE
      INSERT INTO inventory_movements (item_id, employee_id, type, quantity, notes)
      SELECT treatment_inventory_items.inventory_item_id,
        target_appointment.employee_id,
        'in',
        SUM(treatment_inventory_items.quantity),
        'Reposición por cita eliminada'
      FROM appointment_treatments
      JOIN treatment_inventory_items
        ON treatment_inventory_items.treatment_id = appointment_treatments.treatment_id
      WHERE appointment_treatments.appointment_id = p_appointment_id
      GROUP BY treatment_inventory_items.inventory_item_id;
    END IF;
  END IF;

  DELETE FROM appointment_inventory_items
  WHERE appointment_id = p_appointment_id;

  DELETE FROM appointment_treatments
  WHERE appointment_id = p_appointment_id;

  DELETE FROM appointments
  WHERE id = p_appointment_id;
END;
$function$;


-- ---------------------------------------------------------------------------
-- 2. Alta y modificación: solo personal interno
-- ---------------------------------------------------------------------------
/*
 * Las dos políticas de INSERT y las dos de UPDATE llevaban una rama
 * `employee_id = auth.uid() AND is_external_member(...)`. Las políticas se
 * suman con OR, así que bastaba una para dejar pasar al externo.
 *
 * De paso desaparece la duplicidad que señalaba la #163:
 * `appointments_insert_active_clinic` englobaba a `appointments_insert_internal`
 * y la segunda no añadía nada.
 */

DROP POLICY IF EXISTS appointments_insert_active_clinic ON public.appointments;
DROP POLICY IF EXISTS appointments_insert_internal ON public.appointments;
DROP POLICY IF EXISTS appointments_update_accessible ON public.appointments;
DROP POLICY IF EXISTS appointments_update_active_clinic ON public.appointments;

CREATE POLICY appointments_insert_internal
  ON public.appointments FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT private.can_manage_clinic(
      clinic_id, ARRAY['admin', 'reception', 'doctor']
    ))
  );

CREATE POLICY appointments_update_internal
  ON public.appointments FOR UPDATE TO authenticated
  USING (
    (SELECT private.can_manage_clinic(
      clinic_id, ARRAY['admin', 'reception', 'doctor']
    ))
  )
  WITH CHECK (
    (SELECT private.can_manage_clinic(
      clinic_id, ARRAY['admin', 'reception', 'doctor']
    ))
  );
