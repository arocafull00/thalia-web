/*
 * Custodia del refresh token de Google Calendar (#96).
 *
 * El token no se guarda en ninguna tabla: vive cifrado en Vault y la conexión
 * solo conserva un puntero. Estas funciones son el único camino para escribirlo
 * y leerlo, y las tres están cerradas a `service_role`.
 *
 * Viven en `public` y no en `private` porque PostgREST solo expone `public`, y
 * el Route Handler las llama por RPC. Que sean alcanzables por la API es justo
 * el motivo por el que los permisos de abajo no son opcionales: sin ellos
 * cualquier usuario autenticado podría pedir el token de un compañero pasando
 * su id.
 */

CREATE OR REPLACE FUNCTION public.store_google_calendar_connection(
  p_employee_id UUID,
  p_google_email TEXT,
  p_refresh_token TEXT,
  p_granted_scopes TEXT[]
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_secret_id UUID;
BEGIN
  SELECT connection.refresh_token_secret_id
    INTO v_secret_id
  FROM public.google_calendar_connections AS connection
  WHERE connection.employee_id = p_employee_id;

  IF v_secret_id IS NULL THEN
    v_secret_id := vault.create_secret(
      p_refresh_token,
      'google_calendar_refresh_token_' || p_employee_id::TEXT,
      'Refresh token de Google Calendar'
    );
  ELSE
    /*
     * Reconexión: se reescribe el secreto en lugar de crear otro. Crear uno
     * nuevo dejaría el anterior en Vault sin que nada lo apuntase, y un token
     * vivo que nadie vigila es exactamente lo que no queremos.
     */
    PERFORM vault.update_secret(v_secret_id, p_refresh_token);
  END IF;

  INSERT INTO public.google_calendar_connections (
    employee_id,
    google_email,
    refresh_token_secret_id,
    granted_scopes,
    status,
    last_error
  )
  VALUES (
    p_employee_id,
    p_google_email,
    v_secret_id,
    p_granted_scopes,
    'active',
    NULL
  )
  ON CONFLICT (employee_id) DO UPDATE SET
    google_email = EXCLUDED.google_email,
    refresh_token_secret_id = EXCLUDED.refresh_token_secret_id,
    granted_scopes = EXCLUDED.granted_scopes,
    status = 'active',
    last_error = NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.google_calendar_refresh_token(
  p_employee_id UUID
)
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT secret.decrypted_secret
  FROM public.google_calendar_connections AS connection
  JOIN vault.decrypted_secrets AS secret
    ON secret.id = connection.refresh_token_secret_id
  WHERE connection.employee_id = p_employee_id;
$$;

CREATE OR REPLACE FUNCTION public.delete_google_calendar_connection(
  p_employee_id UUID
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_secret_id UUID;
BEGIN
  DELETE FROM public.google_calendar_connections
  WHERE employee_id = p_employee_id
  RETURNING refresh_token_secret_id INTO v_secret_id;

  /*
   * Desconectar tiene que llevarse también el secreto. Si se quedara en Vault,
   * el usuario habría revocado el acceso desde Thalia y su token seguiría
   * guardado y utilizable.
   */
  IF v_secret_id IS NOT NULL THEN
    DELETE FROM vault.secrets WHERE id = v_secret_id;
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.store_google_calendar_connection(
  UUID, TEXT, TEXT, TEXT[]
) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.google_calendar_refresh_token(UUID)
  FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.delete_google_calendar_connection(UUID)
  FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION public.store_google_calendar_connection(
  UUID, TEXT, TEXT, TEXT[]
) TO service_role;
GRANT EXECUTE ON FUNCTION public.google_calendar_refresh_token(UUID)
  TO service_role;
GRANT EXECUTE ON FUNCTION public.delete_google_calendar_connection(UUID)
  TO service_role;
