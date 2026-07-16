import { mkdir } from "node:fs/promises";
import path from "node:path";

import { expect, test as setup } from "@playwright/test";

import { E2E_DATA, E2E_USER } from "./e2e-constants";

const authDirectory = path.join("src", "tests", "e2e", ".auth");
const authFile = path.join(authDirectory, "user.json");

setup("inicia sesión con el usuario E2E", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/Correo electrónico/).fill(E2E_USER.email);
  await page.getByLabel(/Contraseña/).fill(E2E_USER.password);
  await page
    .locator("form")
    .getByRole("button", { name: "Iniciar sesión", exact: true })
    .click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(
    page.getByRole("button", { name: new RegExp(E2E_DATA.clinic) }),
  ).toBeVisible();

  await mkdir(authDirectory, { recursive: true });
  await page.context().storageState({ path: authFile });
});
