DO $migration$
BEGIN
  WITH ranked_active_invitations AS (
    SELECT
      invitation.id,
      row_number() OVER (
        PARTITION BY invitation.clinic_id, lower(trim(invitation.email))
        ORDER BY invitation.created_at DESC, invitation.id DESC
      ) AS duplicate_position
    FROM public.invitation_tokens invitation
    WHERE invitation.used_at IS NULL
      AND invitation.expires_at > now()
  )
  DELETE FROM public.invitation_tokens invitation
  USING ranked_active_invitations ranked
  WHERE invitation.id = ranked.id
    AND ranked.duplicate_position > 1;

  EXECUTE $definition$
    CREATE OR REPLACE FUNCTION public.create_pending_employee_invitation(
      p_clinic_id UUID,
      p_email TEXT,
      p_role TEXT,
      p_created_by UUID,
      p_expires_at TIMESTAMPTZ
    )
    RETURNS public.invitation_tokens
    LANGUAGE plpgsql
    SECURITY INVOKER
    SET search_path = ''
    AS $function$
    DECLARE
      invitation public.invitation_tokens;
      normalized_email TEXT;
    BEGIN
      normalized_email := lower(trim(p_email));

      PERFORM pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(
          p_clinic_id::TEXT || ':' || normalized_email,
          0
        )
      );

      IF EXISTS (
        SELECT 1
        FROM public.invitation_tokens existing_invitation
        WHERE existing_invitation.clinic_id = p_clinic_id
          AND lower(trim(existing_invitation.email)) = normalized_email
          AND existing_invitation.used_at IS NULL
          AND existing_invitation.expires_at > now()
      ) THEN
        RAISE EXCEPTION 'invitation_already_pending';
      END IF;

      INSERT INTO public.invitation_tokens (
        clinic_id,
        role,
        email,
        created_by,
        expires_at
      )
      VALUES (
        p_clinic_id,
        p_role,
        normalized_email,
        p_created_by,
        p_expires_at
      )
      RETURNING * INTO invitation;

      RETURN invitation;
    END;
    $function$
  $definition$;

  EXECUTE $definition$
    CREATE OR REPLACE FUNCTION public.replace_pending_employee_invitation(
      p_invitation_id UUID,
      p_clinic_id UUID,
      p_email TEXT,
      p_role TEXT,
      p_created_by UUID,
      p_expires_at TIMESTAMPTZ
    )
    RETURNS public.invitation_tokens
    LANGUAGE plpgsql
    SECURITY INVOKER
    SET search_path = ''
    AS $function$
    DECLARE
      current_invitation public.invitation_tokens;
      replacement public.invitation_tokens;
      normalized_email TEXT;
    BEGIN
      SELECT invitation.*
      INTO current_invitation
      FROM public.invitation_tokens invitation
      WHERE invitation.id = p_invitation_id
        AND invitation.clinic_id = p_clinic_id
      FOR UPDATE;

      IF NOT FOUND
        OR current_invitation.used_at IS NOT NULL
        OR current_invitation.expires_at <= now()
      THEN
        RAISE EXCEPTION 'invitation_not_pending';
      END IF;

      normalized_email := lower(trim(p_email));

      PERFORM pg_catalog.pg_advisory_xact_lock(
        pg_catalog.hashtextextended(
          p_clinic_id::TEXT || ':' || normalized_email,
          0
        )
      );

      IF EXISTS (
        SELECT 1
        FROM public.invitation_tokens invitation
        WHERE invitation.clinic_id = p_clinic_id
          AND invitation.id <> p_invitation_id
          AND lower(trim(invitation.email)) = normalized_email
          AND invitation.used_at IS NULL
          AND invitation.expires_at > now()
      ) THEN
        RAISE EXCEPTION 'invitation_already_pending';
      END IF;

      DELETE FROM public.invitation_tokens
      WHERE id = p_invitation_id;

      INSERT INTO public.invitation_tokens (
        clinic_id,
        role,
        email,
        created_by,
        expires_at
      )
      VALUES (
        p_clinic_id,
        p_role,
        normalized_email,
        p_created_by,
        p_expires_at
      )
      RETURNING * INTO replacement;

      RETURN replacement;
    END;
    $function$
  $definition$;

  EXECUTE 'REVOKE ALL ON FUNCTION public.create_pending_employee_invitation(UUID, TEXT, TEXT, UUID, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated';
  EXECUTE 'GRANT EXECUTE ON FUNCTION public.create_pending_employee_invitation(UUID, TEXT, TEXT, UUID, TIMESTAMPTZ) TO service_role';
END;
$migration$;
