import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const adminUrl = process.env.E2E_SUPABASE_URL;
const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;

test.use({ storageState: { cookies: [], origins: [] } });

test("registra un propietario, crea la clínica y espera la activación de la suscripción", async ({ page }) => {
  test.skip(!adminUrl || !adminKey, "Requiere Supabase local con Edge Functions");
  test.slow();

  const admin = createClient(adminUrl!, adminKey!, {
    auth: { persistSession: false },
  });
  const suffix = Date.now();
  const clinicName = `E2E Clínica Alta ${suffix}`;
  const email = `e2e-propietario-${suffix}@landora.test`;

  await page.goto("/register");
  await page.getByRole("button", { name: /Soy propietario/ }).click();
  await page.getByLabel("Nombre completo").fill("Propietario E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill("ThaliaE2E123!");
  await page.getByLabel("Confirmar contraseña").fill("ThaliaE2E123!");
  await page.getByRole("button", { name: "Continuar" }).click();

  await expect(page.getByRole("heading", { name: "Configura tu clínica" })).toBeVisible();
  await page.getByLabel("Nombre de la clínica").fill(clinicName);
  await page.getByLabel(/Dirección/).fill("Calle Prueba 12, Madrid");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByRole("heading", { name: "Revisa los datos" })).toBeVisible();
  await expect(page.getByText(clinicName)).toBeVisible();
  await page.getByRole("button", { name: "Crear clínica" }).click();

  await expect(page).toHaveURL(/\/subscription$/, { timeout: 45_000 });
  await expect(page.getByRole("heading", { name: "Empieza tu prueba gratuita" })).toBeVisible();
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/subscription$/, { timeout: 20_000 });

  const { data: clinic, error: clinicError } = await admin
    .from("clinics")
    .select("id")
    .eq("name", clinicName)
    .single();
  expect(clinicError).toBeNull();
  expect(clinic).not.toBeNull();

  await page.goto("/subscription?checkout=success");
  await expect(page.getByRole("heading", { name: "Confirmando tu suscripción" })).toBeVisible();

  const { error: billingError } = await admin
    .from("clinic_billing")
    .update({
      subscription_status: "active",
      current_period_ends_at: new Date(Date.now() + 86_400_000).toISOString(),
    })
    .eq("clinic_id", clinic!.id);
  expect(billingError).toBeNull();

  await expect(page).toHaveURL(/\/invite-team$/, { timeout: 40_000 });
  await page.getByRole("button", { name: "Saltar" }).click();
  await expect(page).toHaveURL(/\/dashboard$/, { timeout: 20_000 });
  await expect(page.getByTestId("dashboard-page")).toBeVisible();
});
