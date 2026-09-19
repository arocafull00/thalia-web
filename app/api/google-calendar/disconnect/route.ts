import {
  deleteThaliaCalendar,
  revokeGoogleToken,
} from "@/lib/google-calendar/calendar";
import { refreshAccessToken } from "@/lib/google-calendar/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "No autenticado" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data: connection } = await admin
    .from("google_calendar_connections")
    .select("calendar_id")
    .eq("employee_id", user.id)
    .maybeSingle();

  if (!connection) {
    return Response.json({ disconnected: true });
  }

  const { data: refreshToken } = await admin.rpc(
    "google_calendar_refresh_token",
    { p_employee_id: user.id },
  );

  /*
   * Se intenta limpiar en Google antes de soltar el token, pero sin dejar que
   * un fallo ahí bloquee la desconexión: si Google no responde, lo que el
   * usuario ha pedido —que Thalia deje de tener acceso— se cumple igual
   * borrando la credencial de nuestro lado.
   */
  if (refreshToken) {
    try {
      const { accessToken } = await refreshAccessToken(refreshToken);

      if (connection.calendar_id) {
        await deleteThaliaCalendar(accessToken, connection.calendar_id);
      }

      await revokeGoogleToken(refreshToken);
    } catch (cause) {
      logger.captureException(cause, {
        action: "googleCalendarDisconnectCleanup",
        userId: user.id,
      });
    }
  }

  const { error } = await admin.rpc("delete_google_calendar_connection", {
    p_employee_id: user.id,
  });

  if (error) {
    logger.captureException(error, {
      action: "googleCalendarDisconnect",
      userId: user.id,
    });

    return Response.json(
      { error: "No se pudo desconectar el calendario" },
      { status: 500 },
    );
  }

  return Response.json({ disconnected: true });
}
