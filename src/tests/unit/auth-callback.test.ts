import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "../../../app/(auth)/callback/route";

const { exchangeCodeForSession } = vi.hoisted(() => ({
  exchangeCodeForSession: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { exchangeCodeForSession },
  })),
}));

describe("auth callback", () => {
  beforeEach(() => {
    exchangeCodeForSession.mockResolvedValue({ error: null });
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
});
