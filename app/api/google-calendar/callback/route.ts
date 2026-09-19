import { NextResponse } from "next/server";

import { createThaliaCalendar } from "@/lib/google-calendar/calendar";
import {
  exchangeCodeForTokens,
  getGoogleCalendarRedirectUri,
  GOOGLE_CALENDAR_STATE_COOKIE,
} from "@/lib/google-calendar/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const SETTINGS_PATH = "/settings/usuario";

function settingsUrl(origin: string, outcome: string) {
  const url = new URL(SETTINGS_PATH, origin);
  url.searchParams.set("calendario", outcome);

  return url;
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const origin = new URL(getGoogleCalendarRedirectUri()).origin;

  const response = NextResponse.redirect(settingsUrl(origin, "error"));
  // Un intento es un intento: el estado se consume pase lo que pase.
  response.cookies.delete(GOOGLE_CALENDAR_STATE_COOKIE);

  const failWith = (reason: string, extra?: Record<string, unknown>) => {
    logger.captureException(new Error(reason), {
      action: "googleCalendarCallback",
      ...extra,
    });

    return response;
  };

  /*
   * Google devuelve `error=access_denied` cuando el usuario cancela en la
   * pantalla de permisos. No es un fallo: se vuelve a Ajustes sin ruido.
   */
  const googleError = requestUrl.searchParams.get("error");

  if (googleError) {
    const cancelled = NextResponse.redirect(
      settingsUrl(
        origin,
        googleError === "access_denied" ? "cancelado" : "error",
      ),
    );
    cancelled.cookies.delete(GOOGLE_CALENDAR_STATE_COOKIE);

    return cancelled;
  }

  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const expectedState = request.headers
    .get("cookie")
    ?.split("; ")
    .find((entry) => entry.startsWith(`${GOOGLE_CALENDAR_STATE_COOKIE}=`))
    ?.split("=")[1];

  if (!code) {
    return failWith("El callback de Google llegó sin código");
  }

  if (!state || !expectedState || state !== expectedState) {
    return failWith("El estado del callback no coincide con la cookie");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", origin));
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    /*
     * Sin refresh token no hay integración que valga: el access token dura una
     * hora y el worker corre de madrugada. Se pide `prompt=consent` justo para
     * que Google lo entregue siempre, así que llegar aquí sin él significa que
     * algo va mal en la configuración y es mejor no dejar una conexión a medias
     * que fallaría en silencio mañana.
     */
    if (!tokens.refreshToken) {
      return failWith("Google no devolvió refresh token", { userId: user.id });
    }

    if (!tokens.email) {
      return failWith("Google no devolvió el correo de la cuenta", {
        userId: user.id,
      });
    }

    const admin = createAdminClient();

    const { data: membership } = await admin
      .from("clinic_memberships")
      .select("clinics(name, timezone)")
      .eq("user_id", user.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();

    const clinic = membership?.clinics as
      { name: string; timezone: string | null } | undefined;

    const calendar = await createThaliaCalendar(
      tokens.accessToken,
      clinic?.name ? `Thalia — ${clinic.name}` : "Thalia",
      clinic?.timezone ?? "Europe/Madrid",
    );

    const { error: storeError } = await admin.rpc(
      "store_google_calendar_connection",
      {
        p_employee_id: user.id,
        p_google_email: tokens.email,
        p_refresh_token: tokens.refreshToken,
        p_granted_scopes: tokens.grantedScopes,
      },
    );

    if (storeError) {
      throw storeError;
    }

    const { error: calendarError } = await admin
      .from("google_calendar_connections")
      .update({ calendar_id: calendar.id })
      .eq("employee_id", user.id);

    if (calendarError) {
      throw calendarError;
    }

    const connected = NextResponse.redirect(settingsUrl(origin, "conectado"));
    connected.cookies.delete(GOOGLE_CALENDAR_STATE_COOKIE);

    return connected;
  } catch (cause) {
    logger.captureException(cause, {
      action: "googleCalendarCallback",
      userId: user.id,
    });

    return response;
  }
}
