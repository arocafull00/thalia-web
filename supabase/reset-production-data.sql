DO $reset$
DECLARE
  table_list TEXT;
BEGIN
  SELECT string_agg(
    format('%I.%I', schemaname, tablename),
    ', ' ORDER BY tablename
  )
  INTO table_list
  FROM pg_tables
  WHERE schemaname = 'public';

  IF table_list IS NULL THEN
    RAISE EXCEPTION 'No public tables were found';
  END IF;

  EXECUTE 'TRUNCATE TABLE ' || table_list || ' RESTART IDENTITY CASCADE';
END
$reset$;
