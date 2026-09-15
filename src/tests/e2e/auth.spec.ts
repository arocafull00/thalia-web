import { expect, test } from "@playwright/test";

import { E2E_USER } from "./e2e-constants";

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
