import { supabase } from "@/lib/supabase";
import { unwrapSupabaseNullable } from "@/lib/supabase-query";
import type { GoogleCalendarConnection } from "@/types/database.types";

/*
 * Se piden las columnas una a una y no con `*`: el resto de la tabla —el
 * puntero al token en Vault y `last_error`— está revocado para `authenticated`,
 * y un `select *` devolvería un error de permisos en lugar de la fila.
 */
const CONNECTION_SELECT =
  "employee_id, google_email, calendar_id, status, last_sync_at, created_at, updated_at";

export async function getGoogleCalendarConnection(
  employeeId: string,
): Promise<GoogleCalendarConnection | null> {
  const { data, error } = await supabase
    .from("google_calendar_connections")
    .select(CONNECTION_SELECT)
    .eq("employee_id", employeeId)
    .maybeSingle();

  return unwrapSupabaseNullable(data, error);
}

/*
 * Desconectar pasa por la API y no por la tabla porque hay que revocar el
 * permiso en Google y borrar el secreto de Vault, y ninguna de las dos cosas
 * puede hacerlas el navegador.
 */
export async function disconnectGoogleCalendar(): Promise<void> {
  const response = await fetch("/api/google-calendar/disconnect", {
    method: "POST",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(payload?.error ?? "No se pudo desconectar el calendario");
  }
}
