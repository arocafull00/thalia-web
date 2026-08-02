import { expect, test } from "@playwright/test";

test("protege las rutas privadas y permite cerrar sesión", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto("/settings/usuario");
  await page.getByRole("button", { name: /^Cerrar sesión/ }).click();

  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/patients");
  await expect(page).toHaveURL(/\/login$/);
});
