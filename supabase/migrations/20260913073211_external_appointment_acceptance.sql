ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_status_check;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_status_check
  CHECK (status IN (
    'scheduled',
    'pending_external',
    'rejected_external',
    'confirmed',
    'in_progress',
    'completed',
    'cancelled',
    'no_show'
  ));

ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_clinic_employee_start_unique;

CREATE UNIQUE INDEX appointments_clinic_employee_start_unique
  ON public.appointments (clinic_id, employee_id, starts_at)
  WHERE status NOT IN ('cancelled', 'rejected_external');

ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_patient_time_no_overlap;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_patient_time_no_overlap
  EXCLUDE USING gist (
    patient_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status NOT IN ('cancelled', 'rejected_external'));

CREATE INDEX appointments_external_overlap_idx
  ON public.appointments (employee_id, starts_at, ends_at)
  WHERE status IN ('scheduled', 'confirmed', 'in_progress');

CREATE TABLE public.clinic_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id UUID NOT NULL REFERENCES public.clinics(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN (
    'external_appointment_pending',
    'external_appointment_accepted',
    'external_appointment_rejected',
    'external_appointment_cancelled'
  )),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  starts_at TIMESTAMPTZ NOT NULL,
  read_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX clinic_notifications_recipient_clinic_created_idx
  ON public.clinic_notifications (recipient_id, clinic_id, created_at DESC);

CREATE INDEX clinic_notifications_recipient_unread_idx
  ON public.clinic_notifications (recipient_id, clinic_id, created_at DESC)
  WHERE read_at IS NULL AND resolved_at IS NULL;

CREATE TRIGGER clinic_notifications_updated_at
  BEFORE UPDATE ON public.clinic_notifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.clinic_notifications ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.clinic_notifications FROM PUBLIC, anon, authenticated;
GRANT SELECT ON TABLE public.clinic_notifications TO authenticated;
GRANT UPDATE (read_at) ON TABLE public.clinic_notifications TO authenticated;
GRANT ALL ON TABLE public.clinic_notifications TO service_role;

CREATE POLICY clinic_notifications_select_recipient
  ON public.clinic_notifications FOR SELECT TO authenticated
  USING (
    recipient_id = (SELECT auth.uid())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  );

CREATE POLICY clinic_notifications_update_read_at_recipient
  ON public.clinic_notifications FOR UPDATE TO authenticated
  USING (
    recipient_id = (SELECT auth.uid())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  )
  WITH CHECK (
    recipient_id = (SELECT auth.uid())
    AND (SELECT private.has_active_clinic_access(clinic_id))
  );

ALTER PUBLICATION supabase_realtime ADD TABLE public.clinic_notifications;

CREATE OR REPLACE FUNCTION private.is_external_member(
  p_user_id UUID,
  p_clinic_id UUID
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.clinic_memberships membership
    WHERE membership.user_id = p_user_id
      AND membership.clinic_id = p_clinic_id
      AND membership.status = 'active'
      AND membership.role = 'external'
  )
$$;

REVOKE ALL ON FUNCTION private.is_external_member(UUID, UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.is_external_member(UUID, UUID) TO authenticated;

DROP POLICY IF EXISTS appointments_select_same_clinic ON public.appointments;
DROP POLICY IF EXISTS appointments_create_edit_allowed_roles ON public.appointments;
DROP POLICY IF EXISTS appointments_update_allowed_roles ON public.appointments;

CREATE POLICY appointments_select_active_clinic
  ON public.appointments FOR SELECT TO authenticated
  USING (
    (SELECT private.has_active_clinic_access(clinic_id))
    AND (
      NOT (SELECT private.is_external_user())
      OR employee_id = (SELECT auth.uid())
    )
  );

CREATE POLICY appointments_insert_active_clinic
  ON public.appointments FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT private.can_manage_clinic(
      clinic_id,
      ARRAY['admin', 'reception', 'doctor']
    ))
    OR (
      employee_id = (SELECT auth.uid())
      AND (SELECT private.is_external_member((SELECT auth.uid()), clinic_id))
    )
  );

CREATE POLICY appointments_update_active_clinic
  ON public.appointments FOR UPDATE TO authenticated
  USING (
    (SELECT private.can_manage_clinic(
      clinic_id,
      ARRAY['admin', 'reception', 'doctor']
    ))
    OR (
      employee_id = (SELECT auth.uid())
      AND (SELECT private.is_external_member((SELECT auth.uid()), clinic_id))
    )
  )
  WITH CHECK (
    (SELECT private.can_manage_clinic(
      clinic_id,
      ARRAY['admin', 'reception', 'doctor']
    ))
    OR (
      employee_id = (SELECT auth.uid())
      AND (SELECT private.is_external_member((SELECT auth.uid()), clinic_id))
    )
  );

CREATE OR REPLACE FUNCTION private.enforce_external_appointment_state()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id UUID := (SELECT auth.uid());
  target_is_external BOOLEAN;
  actor_is_external_self BOOLEAN;
  schedule_changed BOOLEAN := false;
  employee_changed BOOLEAN := false;
  response_authorized BOOLEAN := current_setting(
    'thalia.external_appointment_response',
    true
  ) = 'authorized';
BEGIN
  target_is_external := private.is_external_member(NEW.employee_id, NEW.clinic_id);
  actor_is_external_self := actor_id = NEW.employee_id AND target_is_external;

  IF TG_OP = 'INSERT' THEN
    IF actor_id IS NULL THEN
      RETURN NEW;
    END IF;

    IF target_is_external THEN
      NEW.status := CASE
        WHEN actor_is_external_self THEN 'scheduled'
        ELSE 'pending_external'
      END;
    END IF;

    RETURN NEW;
  END IF;

  schedule_changed := NEW.starts_at IS DISTINCT FROM OLD.starts_at
    OR NEW.ends_at IS DISTINCT FROM OLD.ends_at;
  employee_changed := NEW.employee_id IS DISTINCT FROM OLD.employee_id;

  IF OLD.status = 'pending_external'
    AND NEW.status IS DISTINCT FROM OLD.status
    AND NOT response_authorized
    AND NOT schedule_changed
    AND NOT employee_changed
  THEN
    IF NOT (NEW.status = 'cancelled' AND NOT actor_is_external_self) THEN
      RAISE EXCEPTION USING
        ERRCODE = 'P0001',
        MESSAGE = 'La cita pendiente debe responderse desde la acción del profesional.';
    END IF;
  END IF;

  IF OLD.status = 'rejected_external'
    AND NEW.status IS DISTINCT FROM OLD.status
    AND NOT response_authorized
    AND NOT schedule_changed
    AND NOT employee_changed
  THEN
    RAISE EXCEPTION USING
      ERRCODE = 'P0001',
      MESSAGE = 'La cita rechazada debe volver a solicitarse cambiando su horario o profesional.';
  END IF;

  IF target_is_external AND (schedule_changed OR employee_changed) THEN
    NEW.status := CASE
      WHEN actor_is_external_self THEN 'scheduled'
      ELSE 'pending_external'
    END;
  ELSIF NOT target_is_external
    AND employee_changed
    AND OLD.status IN ('pending_external', 'rejected_external')
  THEN
    NEW.status := 'scheduled';
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER appointments_external_state
  BEFORE INSERT OR UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION private.enforce_external_appointment_state();

CREATE OR REPLACE FUNCTION private.notify_external_appointment_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  actor_id UUID := (SELECT auth.uid());
  old_is_external BOOLEAN := false;
  new_is_external BOOLEAN;
  schedule_changed BOOLEAN := false;
  employee_changed BOOLEAN := false;
BEGIN
  IF actor_id IS NULL THEN
    RETURN NEW;
  END IF;

  new_is_external := private.is_external_member(NEW.employee_id, NEW.clinic_id);

  IF TG_OP = 'UPDATE' THEN
    old_is_external := private.is_external_member(OLD.employee_id, OLD.clinic_id);
    schedule_changed := NEW.starts_at IS DISTINCT FROM OLD.starts_at
      OR NEW.ends_at IS DISTINCT FROM OLD.ends_at;
    employee_changed := NEW.employee_id IS DISTINCT FROM OLD.employee_id;

    IF OLD.status = 'pending_external'
      AND (
        NEW.status IS DISTINCT FROM OLD.status
        OR schedule_changed
        OR employee_changed
      )
    THEN
      UPDATE public.clinic_notifications
      SET resolved_at = now()
      WHERE appointment_id = OLD.id
        AND recipient_id = OLD.employee_id
        AND type = 'external_appointment_pending'
        AND resolved_at IS NULL;
    END IF;

    IF old_is_external
      AND actor_id IS DISTINCT FROM OLD.employee_id
      AND (
        employee_changed
        OR (OLD.status <> 'cancelled' AND NEW.status = 'cancelled')
      )
    THEN
      INSERT INTO public.clinic_notifications (
        clinic_id,
        recipient_id,
        type,
        appointment_id,
        starts_at
      ) VALUES (
        OLD.clinic_id,
        OLD.employee_id,
        'external_appointment_cancelled',
        NULL,
        OLD.starts_at
      );
    END IF;

    IF new_is_external
      AND OLD.employee_id = NEW.employee_id
      AND OLD.status IN ('pending_external', 'rejected_external')
      AND NEW.status = 'scheduled'
    THEN
      INSERT INTO public.clinic_notifications (
        clinic_id,
        recipient_id,
        type,
        appointment_id,
        starts_at
      )
      SELECT
        NEW.clinic_id,
        membership.user_id,
        'external_appointment_accepted',
        NEW.id,
        NEW.starts_at
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = NEW.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin');
    END IF;

    IF new_is_external
      AND OLD.status IS DISTINCT FROM 'rejected_external'
      AND NEW.status = 'rejected_external'
    THEN
      INSERT INTO public.clinic_notifications (
        clinic_id,
        recipient_id,
        type,
        appointment_id,
        starts_at
      )
      SELECT
        NEW.clinic_id,
        membership.user_id,
        'external_appointment_rejected',
        NEW.id,
        NEW.starts_at
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = NEW.clinic_id
        AND membership.status = 'active'
        AND membership.role IN ('owner', 'admin');
    END IF;
  END IF;

  IF new_is_external
    AND NEW.status = 'pending_external'
    AND actor_id IS DISTINCT FROM NEW.employee_id
    AND (
      TG_OP = 'INSERT'
      OR OLD.status IS DISTINCT FROM 'pending_external'
      OR schedule_changed
      OR employee_changed
    )
  THEN
    INSERT INTO public.clinic_notifications (
      clinic_id,
      recipient_id,
      type,
      appointment_id,
      starts_at
    ) VALUES (
      NEW.clinic_id,
      NEW.employee_id,
      'external_appointment_pending',
      NEW.id,
      NEW.starts_at
    );
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER appointments_external_notifications
  AFTER INSERT OR UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION private.notify_external_appointment_change();

CREATE OR REPLACE FUNCTION public.respond_external_appointment(
  p_appointment_id UUID,
  p_clinic_id UUID,
  p_decision TEXT,
  p_allow_overlap BOOLEAN,
  p_expected_updated_at TIMESTAMPTZ
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
  SET status = CASE
    WHEN p_decision = 'accept' THEN 'scheduled'
    ELSE 'rejected_external'
  END
  WHERE id = target.id
  RETURNING * INTO updated_target;

  RETURN jsonb_build_object(
    'outcome', CASE WHEN p_decision = 'accept' THEN 'accepted' ELSE 'rejected' END,
    'appointment', to_jsonb(updated_target)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.respond_external_appointment(
  UUID,
  UUID,
  TEXT,
  BOOLEAN,
  TIMESTAMPTZ
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.respond_external_appointment(
  UUID,
  UUID,
  TEXT,
  BOOLEAN,
  TIMESTAMPTZ
) TO authenticated;
