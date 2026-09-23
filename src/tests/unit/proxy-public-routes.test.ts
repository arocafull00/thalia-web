import { NextRequest, NextResponse } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { proxy } from "../../../proxy";

const { updateSession } = vi.hoisted(() => ({
  updateSession: vi.fn(),
}));

vi.mock("@/lib/supabase/proxy", () => ({
  updateSession,
  withSessionCookies: (target: NextResponse) => target,
}));

function requestFor(pathname: string) {
  return new NextRequest(new URL(`https://thalia-app.es${pathname}`));
}

describe("proxy public routes", () => {
  beforeEach(() => {
    // Visitante anónimo: es el único caso en el que la lista importa.
    updateSession.mockResolvedValue({
      supabaseResponse: NextResponse.next(),
      userId: undefined,
    });
  });

  /*
   * La política de privacidad se enlaza desde el pie del login, así que la lee
   * precisamente quien no ha iniciado sesión. Fuera de esta lista el proxy la
   * devolvía a /login y el documento quedaba inaccesible.
   */
  it.each([
    "/privacidad",
    "/terms",
    "/aviso-legal",
    "/login",
    "/cita/token-de-prueba",
    // La llama pg_cron sin sesión; se protege con su propio secreto.
    "/api/google-calendar/sync",
  ])("deja pasar a un anónimo por %s", async (pathname) => {
    const response = await proxy(requestFor(pathname));

    expect(response.headers.get("location")).toBeNull();
  });

  it("sigue protegiendo las rutas privadas", async () => {
    const response = await proxy(requestFor("/dashboard"));

    expect(response.headers.get("location")).toBe(
      "https://thalia-app.es/login",
    );
  });
});
