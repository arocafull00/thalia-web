CREATE SCHEMA IF NOT EXISTS extensions;

CREATE EXTENSION IF NOT EXISTS hypopg WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS index_advisor WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;

CREATE OR REPLACE FUNCTION public.rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog
AS $$
DECLARE
  cmd RECORD;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table', 'partitioned table')
  LOOP
    IF cmd.schema_name = 'public' THEN
      BEGIN
        EXECUTE format(
          'ALTER TABLE IF EXISTS %s ENABLE ROW LEVEL SECURITY',
          cmd.object_identity
        );
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
    ELSE
      RAISE LOG 'rls_auto_enable: skipped % in schema %',
        cmd.object_identity,
        cmd.schema_name;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.rls_auto_enable() FROM PUBLIC, anon, authenticated;

DROP EVENT TRIGGER IF EXISTS ensure_rls;
CREATE EVENT TRIGGER ensure_rls
  ON ddl_command_end
  WHEN TAG IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
  EXECUTE FUNCTION public.rls_auto_enable();

DROP POLICY IF EXISTS clinics_select_same_clinic ON public.clinics;
DROP POLICY IF EXISTS clinics_select_memberships ON public.clinics;

CREATE POLICY clinics_select_memberships
  ON public.clinics FOR SELECT TO authenticated
  USING ((SELECT private.has_active_clinic_access(id)));

DROP POLICY IF EXISTS clinic_admins_can_update_clinic ON public.clinics;

CREATE POLICY clinic_admins_can_update_clinic
  ON public.clinics FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = clinics.id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.clinic_memberships membership
      WHERE membership.clinic_id = clinics.id
        AND membership.user_id = (SELECT auth.uid())
        AND membership.role IN ('owner', 'admin')
        AND membership.status = 'active'
    )
  );

DO $$
DECLARE
  reminder_command TEXT;
BEGIN
  IF to_regclass('vault.decrypted_secrets') IS NULL
     OR NOT EXISTS (
       SELECT 1
       FROM vault.decrypted_secrets
       WHERE name = 'service_role_key'
     )
  THEN
    RETURN;
  END IF;

  reminder_command := $command$
    SELECT net.http_post(
      url := 'https://pbbjmwldvkjxntcqlwdz.supabase.co/functions/v1/send-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          SELECT decrypted_secret
          FROM vault.decrypted_secrets
          WHERE name = 'service_role_key'
        )
      ),
      body := '{}'::jsonb
    );
  $command$;

  PERFORM cron.schedule(
    'send-whatsapp-reminders',
    '*/30 * * * *',
    reminder_command
  );
END;
$$;
