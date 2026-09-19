import { randomBytes } from "node:crypto";

import { NextResponse } from "next/server";

import {
  buildGoogleConsentUrl,
  getGoogleCalendarRedirectUri,
  GOOGLE_CALENDAR_STATE_COOKIE,
} from "@/lib/google-calendar/server";
import { logger } from "@/lib/logger";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const canonical = new URL(getGoogleCalendarRedirectUri());

  /*
   * Si el usuario llega por un host que no es el canónico, se le reenvía antes
   * de empezar nada.
   *
   * La URI de retorno que Google exige es fija, así que el callback aterrizará
   * en el host canónico sí o sí. Si el flujo arrancase en `www`, la cookie del
   * estado se escribiría ahí y al volver no viajaría: el mismo fallo de la
   * #161, que costó una tarde entera de depuración.
   */
  if (requestUrl.host !== canonical.host) {
    return NextResponse.redirect(
      new URL("/api/google-calendar/connect", canonical.origin),
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", canonical.origin));
  }

  const state = randomBytes(32).toString("base64url");

  const response = NextResponse.redirect(buildGoogleConsentUrl(state));

  /*
   * El estado se guarda en cookie y se compara al volver: es lo que impide que
   * alguien induzca a un usuario a enlazar una cuenta de Google ajena.
   *
   * `lax` porque el retorno es una navegación de primer nivel desde Google, que
   * con `strict` no llevaría la cookie. Y caduca en diez minutos: pasado ese
   * rato el intento se da por perdido en lugar de quedar abierto.
   */
  response.cookies.set(GOOGLE_CALENDAR_STATE_COOKIE, state, {
    httpOnly: true,
    secure: canonical.protocol === "https:",
    sameSite: "lax",
    path: "/api/google-calendar",
    maxAge: 600,
  });

  logger.info("[google-calendar] inicio de conexión", { userId: user.id });

  return response;
}
