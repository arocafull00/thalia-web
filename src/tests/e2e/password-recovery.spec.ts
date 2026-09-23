import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const adminUrl = process.env.E2E_SUPABASE_URL;
const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const mailpitUrl = "http://127.0.0.1:54324";

test.use({ storageState: { cookies: [], origins: [] } });

test("recupera la contraseña mediante el correo local", async ({ page }) => {
  test.skip(!adminUrl || !adminKey || !publishableKey, "Requiere Supabase local y Mailpit");
  test.slow();

  const admin = createClient(adminUrl!, adminKey!, {
    auth: { persistSession: false },
  });
  const email = `e2e-recuperacion-${Date.now()}@landora.test`;
  const newPassword = "NuevaThaliaE2E123!";
  const { data, error: createError } = await admin.auth.admin.createUser({
    email,
    password: "AnteriorThaliaE2E123!",
    email_confirm: true,
  });
  expect(createError).toBeNull();
  expect(data.user).not.toBeNull();

  try {
    await page.goto("/forgot-password");
    await page.getByLabel(/Correo electrónico/).fill(email);
    await page.getByRole("button", { name: "Enviar enlace" }).click();
    await expect(page.getByText(/Revisa tu bandeja de entrada/)).toBeVisible();

    let recoveryLink = "";
    await expect.poll(async () => {
      const response = await fetch(
        `${mailpitUrl}/view/latest.txt?query=${encodeURIComponent(`to:${email}`)}`,
      );
      if (!response.ok) return "";
      const body = await response.text();
      recoveryLink =
        body.match(/https?:\/\/[^\s<>"']+/g)?.find((url) => url.includes("type=recovery")) ?? "";
      return recoveryLink;
    }, { timeout: 20_000 }).not.toBe("");

    await page.goto(recoveryLink);
    await expect(page.getByRole("heading", { name: "Establecer nueva contraseña" })).toBeVisible({ timeout: 20_000 });
    await page.getByLabel("Nueva contraseña").fill(newPassword);
    await page.getByLabel("Confirmar contraseña").fill(newPassword);
    await page.getByRole("button", { name: "Cambiar contraseña" }).click();
    await expect(page.getByText(/Contraseña actualizada correctamente/)).toBeVisible({ timeout: 20_000 });

    const verifier = createClient(adminUrl!, publishableKey!, {
      auth: { persistSession: false },
    });
    const { data: session, error: loginError } = await verifier.auth.signInWithPassword({
      email,
      password: newPassword,
    });
    expect(loginError).toBeNull();
    expect(session.user?.email).toBe(email);
  } finally {
    if (data.user) await admin.auth.admin.deleteUser(data.user.id);
  }
});
