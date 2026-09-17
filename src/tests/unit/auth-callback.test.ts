import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "../../../app/(auth)/callback/route";

const { exchangeCodeForSession, captureException } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
  captureException: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { exchangeCodeForSession },
  })),
}));

vi.mock("@/lib/logger", () => ({
  logger: { captureException },
}));

describe("auth callback", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
    captureException.mockClear();
  });

  it("returns legacy recovery failures to the reset page", async () => {
    const response = await GET(
      new Request(
        "https://thalia-web.vercel.app/callback?next=/reset-password",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://thalia-web.vercel.app/reset-password?error_code=invalid_recovery_link",
    );
  });

  it("rejects external next destinations", async () => {
    const response = await GET(
      new Request(
        "https://thalia-web.vercel.app/callback?next=https://example.com",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://thalia-web.vercel.app/login?error=oauth",
    );
  });

  it("keeps successful legacy recovery links on the reset route", async () => {
    const response = await GET(
      new Request(
        "https://thalia-web.vercel.app/callback?code=recovery-code&next=/reset-password",
      ),
    );

    expect(exchangeCodeForSession).toHaveBeenCalledWith("recovery-code");
    expect(response.headers.get("location")).toBe(
      "https://thalia-web.vercel.app/reset-password",
    );
  });

  /*
   * El redirect de error es idéntico venga de donde venga el fallo, así que sin
   * este reporte no hay forma de saber por qué falló un intercambio (#161).
   */
  it("reports the exchange failure before redirecting", async () => {
    const cause = new Error("code verifier should be non-empty");
    exchangeCodeForSession.mockResolvedValue({ error: cause });

    const response = await GET(
      new Request("https://thalia-app.es/callback?code=abc&next=/dashboard"),
    );

    expect(captureException).toHaveBeenCalledWith(cause, {
      action: "exchangeCodeForSession",
      host: "thalia-app.es",
      next: "/dashboard",
    });
    expect(response.headers.get("location")).toBe(
      "https://thalia-app.es/login?error=oauth",
    );
  });
});
