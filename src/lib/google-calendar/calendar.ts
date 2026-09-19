import "server-only";

const GOOGLE_CALENDAR_API = "https://www.googleapis.com/calendar/v3";
const GOOGLE_REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";

async function googleCalendarRequest<T>(
  accessToken: string,
  path: string,
  init: RequestInit,
): Promise<T> {
  const response = await fetch(`${GOOGLE_CALENDAR_API}${path}`, {
    ...init,
    headers: {
      ...init.headers,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: { message?: string };
    } | null;

    throw new Error(
      `Google Calendar respondió ${response.status}: ${
        payload?.error?.message ?? "sin detalle"
      }`,
    );
  }

  return (await response.json()) as T;
}

/*
 * Se crea un calendario secundario propio en lugar de escribir en el principal
 * del profesional. Así su agenda personal queda intacta, puede darle color
 * aparte o silenciarlo, y desconectar es borrar un calendario entero en vez de
 * ir buscando eventos sueltos. Es además lo único que permite el permiso
 * `calendar.app.created`.
 */
export function createThaliaCalendar(
  accessToken: string,
  summary: string,
  timeZone: string,
) {
  return googleCalendarRequest<{ id: string }>(accessToken, "/calendars", {
    method: "POST",
    body: JSON.stringify({
      summary,
      description:
        "Gestionado desde Thalia. Los cambios hechos aquí no se sincronizan.",
      timeZone,
    }),
  });
}

function eventsPath(calendarId: string, eventId?: string) {
  const base = `/calendars/${encodeURIComponent(calendarId)}/events`;

  return eventId ? `${base}/${encodeURIComponent(eventId)}` : base;
}

export function insertEvent(
  accessToken: string,
  calendarId: string,
  body: unknown,
) {
  return googleCalendarRequest<{ id: string }>(
    accessToken,
    eventsPath(calendarId),
    { method: "POST", body: JSON.stringify(body) },
  );
}

export function patchEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
  body: unknown,
) {
  return googleCalendarRequest<{ id: string }>(
    accessToken,
    eventsPath(calendarId, eventId),
    { method: "PATCH", body: JSON.stringify(body) },
  );
}

/*
 * Un 404 o un 410 no son un fallo: significan que el evento ya no está, que es
 * justo lo que queríamos. Tratarlos como error dejaría la fila reintentándose
 * hasta agotar los intentos por un trabajo que ya está hecho.
 */
export async function deleteEvent(
  accessToken: string,
  calendarId: string,
  eventId: string,
) {
  const response = await fetch(
    `${GOOGLE_CALENDAR_API}${eventsPath(calendarId, eventId)}`,
    { method: "DELETE", headers: { Authorization: `Bearer ${accessToken}` } },
  );

  if (response.ok || response.status === 404 || response.status === 410) {
    return;
  }

  throw new Error(`Google Calendar respondió ${response.status} al borrar`);
}

export function deleteThaliaCalendar(accessToken: string, calendarId: string) {
  return fetch(
    `${GOOGLE_CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );
}

/*
 * Revocar en Google además de borrar nuestra copia. Si solo borrásemos el
 * token, el permiso seguiría concedido en la cuenta del usuario y Thalia
 * aparecería indefinidamente en su lista de aplicaciones con acceso.
 */
export function revokeGoogleToken(token: string) {
  return fetch(GOOGLE_REVOKE_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ token }).toString(),
  });
}
