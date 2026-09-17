import { describe, expect, it, vi } from "vitest";

import HomePage from "../../../app/page";

/*
 * `redirect` corta la ejecución lanzando. El mock lo imita: si se limitara a
 * registrar la llamada, la función seguiría hasta el redirect siguiente y el
 * test daría por buenos dos destinos a la vez.
 */
const { redirect } = vi.hoisted(() => ({
  redirect: vi.fn((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`);
  }),
}));

vi.mock("next/navigation", () => ({ redirect }));

describe("home page", () => {
  it("sends anyone without a pending code to the dashboard", async () => {
    await expect(
      HomePage({ searchParams: Promise.resolve({}) }),
    ).rejects.toThrow("NEXT_REDIRECT:/dashboard");
  });

  /*
   * Cuando Supabase descarta el `redirect_to` deja el código en el Site URL,
   * que es esta raíz. Si lo perdemos aquí el login falla sin dejar rastro.
   */
  it("forwards an authorization code to the callback route", async () => {
    await expect(
      HomePage({ searchParams: Promise.resolve({ code: "abc 123" }) }),
    ).rejects.toThrow("NEXT_REDIRECT:/callback?code=abc%20123");
  });
});
