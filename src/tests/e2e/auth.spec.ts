import { expect, test } from "@playwright/test";

import { E2E_USER } from "./e2e-constants";

test("cambia entre inicio de sesión y registro sin salir de la pantalla", async ({
  context,
  page,
}) => {
  await context.clearCookies();
  await page.goto("/login");

  await page.getByRole("tab", { name: "Registrarse" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("¿Cómo quieres registrarte?")).toBeVisible();

  await page.getByRole("button", { name: /Soy propietario/ }).click();
  await expect(page.getByLabel("Nombre completo")).toBeVisible();

  await page.getByRole("tab", { name: "Iniciar sesión" }).click();

  await expect(page).toHaveURL(/\/login$/);
  const loginPanel = page.getByRole("tabpanel", { name: "Iniciar sesión" });
  await expect(loginPanel.getByLabel(/Correo electrónico/)).toBeVisible();
  await expect(loginPanel.getByLabel(/^Contraseña/)).toBeVisible();

  await page.getByRole("tab", { name: "Registrarse" }).click();
  await expect(page.getByLabel("Nombre completo")).toBeVisible();
});

test("protege las rutas privadas y permite cerrar sesión", async ({
  context,
  page,
}) => {
  await context.clearCookies();

  await page.goto("/patients");
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel(/Correo electrónico/).fill(E2E_USER.email);
  await page.getByLabel(/Contraseña/).fill(E2E_USER.password);
  await page
    .locator("form")
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();

  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto("/settings/usuario");
  await page
    .getByRole("region", { name: "Cuenta" })
    .getByRole("button", { name: /^Cerrar sesión/ })
    .click();

  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/patients");
  await expect(page).toHaveURL(/\/login$/);
});
