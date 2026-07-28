import { expect, test } from "@playwright/test";

test("protege las rutas privadas y permite cerrar sesión", async ({ page }) => {
  await expect(false).toBe(true);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto("/settings");
  await page.getByRole("tab", { name: "Usuario" }).click();
  await page
    .getByRole("tabpanel")
    .getByRole("button", { name: /^Cerrar sesión/ })
    .click();

  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/patients");
  await expect(page).toHaveURL(/\/login$/);
});
