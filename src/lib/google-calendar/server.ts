import "server-only";

import { siteUrl } from "@/lib/environment";

/*
 * Solo este permiso: deja crear calendarios secundarios y gestionar sus
 * eventos, y nada más. Con `calendar` o `calendar.events` tendríamos acceso a
 * toda la agenda personal del profesional, que no necesitamos y que Google
 * clasifica en un escalón de revisión más alto.
 */
export const GOOGLE_CALENDAR_SCOPE =
  "https://www.googleapis.com/auth/calendar.app.created";

/*
 * `openid email` va aparte del permiso de calendario y no es un extra
 * cosmético: sin él Google no dice con qué cuenta se ha conectado el usuario, y
 * Ajustes no podría mostrar «conectado como…». Quien tenga dos cuentas de
 * Google —lo normal— no sabría cuál acaba de enlazar. Ambos son no sensibles.
 */
const GOOGLE_REQUESTED_SCOPES = ["openid", "email", GOOGLE_CALENDAR_SCOPE];

/*
 * La comparten la ruta que abre el flujo y la que lo recoge, así que vive aquí
 * y no en una de las dos: que el nombre de la cookie se escriba dos veces es
 * pedir que un día dejen de coincidir.
 */
export const GOOGLE_CALENDAR_STATE_COOKIE = "google-calendar-oauth-state";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export function getGoogleCalendarClientId(): string {
  const clientId = process.env.THALIA_GOOGLE_CALENDAR_OAUTH_ID;

  if (!clientId) {
    throw new Error("THALIA_GOOGLE_CALENDAR_OAUTH_ID no está configurada");
  }

  return clientId;
}

export function getGoogleCalendarClientSecret(): string {
  const clientSecret = process.env.THALIA_GOOGLE_CALENDAR_OAUTH_SECRET;

  if (!clientSecret) {
    throw new Error("THALIA_GOOGLE_CALENDAR_OAUTH_SECRET no está configurada");
  }

  return clientSecret;
}

/*
 * La URI se construye desde `siteUrl` y no desde el host de la petición.
 *
 * Google exige que coincida carácter por carácter con la registrada en la
 * consola, así que derivarla de dónde venga el usuario significaría fallar en
 * cuanto alguien entre por `www`. Es la misma trampa que nos costó la #161, con
 * el agravante de que aquí además se perdería la cookie del estado.
 */
export function getGoogleCalendarRedirectUri(): string {
  const base = siteUrl ?? "http://localhost:3000";

  return new URL("/api/google-calendar/callback", base).toString();
}

export function buildGoogleConsentUrl(state: string): string {
  const url = new URL(GOOGLE_AUTH_ENDPOINT);

  url.searchParams.set("client_id", getGoogleCalendarClientId());
  url.searchParams.set("redirect_uri", getGoogleCalendarRedirectUri());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", GOOGLE_REQUESTED_SCOPES.join(" "));
  url.searchParams.set("state", state);
  /*
   * `offline` es lo que hace que Google entregue un refresh token, y sin él la
   * sincronización moriría en cuanto caducase el primer access token, una hora
   * después. `consent` fuerza la pantalla aunque el usuario ya hubiera
   * aceptado: Google solo devuelve el refresh token la primera vez que se
   * concede, así que sin esto una reconexión llegaría sin la llave.
   */
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");

  return url.toString();
}

export type GoogleTokenResponse = {
  accessToken: string;
  refreshToken: string | null;
  expiresInSeconds: number;
  grantedScopes: string[];
  /** Solo viene en el primer intercambio, no al refrescar. */
  email: string | null;
};

/*
 * El correo viaja dentro del `id_token`, que es un JWT. No se verifica la firma
 * a propósito: este token no llega por el navegador sino como respuesta directa
 * de Google a una petición nuestra autenticada con el client secret y sobre
 * TLS. Verificarlo aquí solo añadiría una descarga de claves públicas sin
 * cambiar de quién nos estamos fiando.
 */
function readEmailFromIdToken(idToken: string | undefined): string | null {
  if (!idToken) {
    return null;
  }

  const payload = idToken.split(".")[1];

  if (!payload) {
    return null;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { email?: string };

    return decoded.email ?? null;
  } catch {
    return null;
  }
}

function parseTokenResponse(payload: {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  id_token?: string;
}): GoogleTokenResponse {
  if (!payload.access_token) {
    throw new Error("Google no devolvió un access token");
  }

  return {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token ?? null,
    expiresInSeconds: payload.expires_in ?? 3600,
    grantedScopes: payload.scope ? payload.scope.split(" ") : [],
    email: readEmailFromIdToken(payload.id_token),
  };
}

async function requestToken(
  body: Record<string, string>,
): Promise<GoogleTokenResponse> {
  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body).toString(),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    /*
     * El cuerpo del error trae `error` y `error_description`, que es lo único
     * que distingue un código caducado de un secreto mal configurado. Se
     * incluye en el mensaje porque sin eso el diagnóstico es imposible; no
     * lleva el token, solo el motivo.
     */
    const reason =
      (payload as { error_description?: string; error?: string } | null)
        ?.error_description ??
      (payload as { error?: string } | null)?.error ??
      `HTTP ${response.status}`;

    throw new Error(`Google rechazó la petición de token: ${reason}`);
  }

  return parseTokenResponse(payload ?? {});
}

export function exchangeCodeForTokens(code: string) {
  return requestToken({
    code,
    client_id: getGoogleCalendarClientId(),
    client_secret: getGoogleCalendarClientSecret(),
    redirect_uri: getGoogleCalendarRedirectUri(),
    grant_type: "authorization_code",
  });
}

export function refreshAccessToken(refreshToken: string) {
  return requestToken({
    refresh_token: refreshToken,
    client_id: getGoogleCalendarClientId(),
    client_secret: getGoogleCalendarClientSecret(),
    grant_type: "refresh_token",
  });
}
