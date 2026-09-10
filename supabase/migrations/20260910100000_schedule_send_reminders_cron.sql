-- Programación del envío de recordatorios en una migración (issue #85)
--
-- El cron existía sólo en el panel de Supabase. Un `db reset`, recrear el
-- proyecto o migrar a otra organización se lo llevaba por delante sin dejar
-- rastro, y los recordatorios dejarían de salir sin que saltara ningún error:
-- nadie recibe un aviso de que no se están enviando avisos.
--
-- Se reutiliza el nombre del job existente, 'send-whatsapp-reminders', porque
-- cron.schedule actualiza el job que coincida en nombre. Programar uno con otro
-- nombre dejaría dos ejecuciones cada media hora.
--
-- ---------------------------------------------------------------------------
-- Requisito manual, una sola vez y sólo en producción
-- ---------------------------------------------------------------------------
--
-- La clave de servicio NO puede vivir en este fichero: se commitearía al repo.
-- Se guarda en Vault y se lee en cada ejecución:
--
--   select vault.create_secret('<service role key>', 'service_role_key');
--
-- Mientras ese secreto no exista, esta migración no programa nada. Eso es
-- deliberado y es lo que protege el entorno local: sin la guarda, cada
-- `supabase db reset` —y `pnpm test:e2e` hace uno— crearía en el contenedor
-- local un cron que llama a la función de PRODUCCIÓN cada 30 minutos y manda
-- WhatsApps reales a pacientes reales.

DO $$
DECLARE
  v_command TEXT;
BEGIN
  -- pg_cron no está habilitado en el Supabase local, así que sin esta
  -- comprobación la migración reventaría el `db reset` de todo el equipo.
  -- to_regprocedure y no to_regproc: cron.schedule está sobrecargada (formas de
  -- 2 y 3 argumentos) y to_regproc no admite firma, así que fallaría.
  IF to_regprocedure('cron.schedule(text,text,text)') IS NULL THEN
    RAISE NOTICE '[#85] pg_cron no disponible: no se programa nada.';
    RETURN;
  END IF;

  IF to_regclass('vault.decrypted_secrets') IS NULL
     OR NOT EXISTS (
       SELECT 1 FROM vault.decrypted_secrets WHERE name = 'service_role_key'
     )
  THEN
    RAISE NOTICE '[#85] falta el secreto service_role_key en Vault: no se programa nada.';
    RETURN;
  END IF;

  /*
   * El comando resuelve la clave en cada ejecución en lugar de llevarla
   * incrustada. Así no queda en claro ni en este fichero ni en la columna
   * cron.job.command, que es donde está hoy.
   *
   * La URL del proyecto no es un secreto —ya aparece en el repo— y va literal
   * para no depender de un segundo secreto en Vault.
   */
  v_command := $cmd$
    SELECT net.http_post(
      url := 'https://pbbjmwldvkjxntcqlwdz.supabase.co/functions/v1/send-reminders',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          SELECT decrypted_secret FROM vault.decrypted_secrets
          WHERE name = 'service_role_key'
        )
      ),
      body := '{}'::jsonb
    );
  $cmd$;

  /*
   * Cada 30 minutos. Antes era obligatorio: la función barría una rodaja de 30
   * minutos y correr cada hora dejaba fuera la mitad de las citas. Ahora que
   * mira las pendientes de las próximas N horas, una pasada perdida la recoge
   * la siguiente, así que esto se podría bajar a '0 * * * *' y halvar las
   * invocaciones. Se deja como estaba para no cambiar dos cosas a la vez.
   */
  PERFORM cron.schedule('send-whatsapp-reminders', '*/30 * * * *', v_command);

  RAISE NOTICE '[#85] cron send-whatsapp-reminders programado.';
END $$;
