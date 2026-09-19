import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildGoogleConsentUrl,
  exchangeCodeForTokens,
  getGoogleCalendarRedirectUri,
} from "@/lib/google-calendar/server";

function idTokenWith(payload: Record<string, unknown>) {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");

  return `cabecera.${body}.firma`;
}

describe("google calendar oauth", () => {
  beforeEach(() => {
    vi.stubEnv("THALIA_GOOGLE_CALENDAR_OAUTH_ID", "id-de-prueba");
    vi.stubEnv("THALIA_GOOGLE_CALENDAR_OAUTH_SECRET", "secreto-de-prueba");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  /*
   * Sin `offline` Google no entrega refresh token, y sin `consent` deja de
   * entregarlo en la segunda conexión. En ambos casos la sincronización moriría
   * a la hora, en silencio y solo en producción.
   */
  it("pide acceso sin caducidad y fuerza la pantalla de permisos", () => {
    const url = new URL(buildGoogleConsentUrl("estado-123"));

    expect(url.searchParams.get("access_type")).toBe("offline");
    expect(url.searchParams.get("prompt")).toBe("consent");
    expect(url.searchParams.get("state")).toBe("estado-123");
  });

  it("solo pide el permiso de calendarios creados por la app", () => {
    const url = new URL(buildGoogleConsentUrl("x"));
    const scopes = (url.searchParams.get("scope") ?? "").split(" ");

    expect(scopes).toContain(
      "https://www.googleapis.com/auth/calendar.app.created",
    );
    // Estos darían acceso a toda la agenda personal del profesional.
    expect(scopes).not.toContain("https://www.googleapis.com/auth/calendar");
    expect(scopes).not.toContain(
      "https://www.googleapis.com/auth/calendar.events",
    );
  });

  it("usa una URI de retorno fija y no el host de quien navega", () => {
    expect(getGoogleCalendarRedirectUri()).toBe(
      "http://localhost:3000/api/google-calendar/callback",
    );
    expect(
      new URL(buildGoogleConsentUrl("x")).searchParams.get("redirect_uri"),
    ).toBe("http://localhost:3000/api/google-calendar/callback");
  });

  it("saca el correo del id_token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          access_token: "acceso",
          refresh_token: "refresco",
          expires_in: 3599,
          scope:
            "openid email https://www.googleapis.com/auth/calendar.app.created",
          id_token: idTokenWith({ email: "pro@gmail.com" }),
        }),
      ),
    );

    const tokens = await exchangeCodeForTokens("codigo");

    expect(tokens.email).toBe("pro@gmail.com");
    expect(tokens.refreshToken).toBe("refresco");
  });

  /*
   * El motivo que devuelve Google es lo único que separa un código caducado de
   * un secreto mal configurado, y los dos se ven igual desde fuera.
   */
  it("propaga el motivo cuando Google rechaza el intercambio", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: "invalid_grant",
            error_description: "Code was already redeemed",
          },
          { status: 400 },
        ),
      ),
    );

    await expect(exchangeCodeForTokens("codigo")).rejects.toThrow(
      "Code was already redeemed",
    );
  });

  /*
   * El código de error importa más que la descripción: `invalid_grant` es lo
   * que dice que el usuario revocó el permiso y que hay que marcar la conexión
   * para reconectar. Una primera versión se quedaba solo con la descripción y
   * dejaba «Bad Request», perdiendo la única señal accionable — la conexión se
   * habría reintentado para siempre sin avisar a nadie.
   */
  it("conserva el código de error, no solo la descripción", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          { error: "invalid_grant", error_description: "Bad Request" },
          { status: 400 },
        ),
      ),
    );

    await expect(exchangeCodeForTokens("codigo")).rejects.toThrow(
      "invalid_grant",
    );
  });
});
