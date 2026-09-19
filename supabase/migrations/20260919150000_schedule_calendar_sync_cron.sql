/*
 * Programa el vaciado de la cola de Google Calendar (#96).
 *
 * Igual que el cron de recordatorios: si falta pg_cron o el secreto en Vault no
 * se programa nada y la migración sigue adelante, para que un entorno sin esas
 * piezas —el local, por ejemplo— no se quede a medias.
 *
 * Antes de desplegar hay que guardar el secreto compartido:
 *   select vault.create_secret('<THALIA_CALENDAR_SYNC_SECRET>', 'calendar_sync_secret');
 * Tiene que ser el mismo valor que la variable de entorno en Vercel.
 */
DO $$
DECLARE
  v_command TEXT;
BEGIN
  IF to_regnamespace('cron') IS NULL THEN
    RAISE NOTICE '[#96] pg_cron no está disponible: no se programa nada.';
    RETURN;
  END IF;

  IF to_regprocedure('cron.schedule(text,text,text)') IS NULL THEN
    RAISE NOTICE '[#96] cron.schedule no tiene la forma esperada.';
    RETURN;
  END IF;

  IF to_regclass('vault.decrypted_secrets') IS NULL
     OR NOT EXISTS (
       SELECT 1 FROM vault.decrypted_secrets WHERE name = 'calendar_sync_secret'
     )
  THEN
    RAISE NOTICE '[#96] falta el secreto calendar_sync_secret en Vault: no se programa nada.';
    RETURN;
  END IF;

  /*
   * El `WHERE EXISTS` es deliberado: sin él despertaríamos la función 288 veces
   * al día para que casi siempre no hiciera nada. Con la base al límite de
   * memoria, una petición que se ahorra es una petición que se ahorra — y hoy
   * la cola está vacía para todo el mundo, porque nadie ha conectado aún.
   *
   * El secreto se resuelve en cada ejecución en lugar de quedar incrustado en
   * `cron.job.command`, que es una tabla legible.
   */
  v_command := $cmd$
    SELECT net.http_post(
      url := 'https://www.thalia-app.es/api/google-calendar/sync',
      headers := jsonb_build_object(
        'Content-Type', 'application/json',
        'Authorization', 'Bearer ' || (
          SELECT decrypted_secret FROM vault.decrypted_secrets
          WHERE name = 'calendar_sync_secret'
        )
      ),
      body := '{}'::jsonb
    )
    WHERE EXISTS (
      SELECT 1 FROM private.calendar_sync_outbox
      WHERE next_attempt_at <= now()
        AND attempts < 8
    );
  $cmd$;

  /*
   * Cada cinco minutos. Una cita que tarda ese rato en aparecer en el móvil del
   * profesional es aceptable; lo que no lo sería es que tardase una hora. Si
   * alguna vez hace falta más inmediatez se puede bajar a un minuto, porque la
   * comprobación de arriba hace que las pasadas en vacío no cuesten casi nada.
   */
  PERFORM cron.schedule('sync-google-calendar', '*/5 * * * *', v_command);

  RAISE NOTICE '[#96] cron sync-google-calendar programado.';
END;
$$;
