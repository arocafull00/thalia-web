import { expect, test } from "@playwright/test";

import { clickTopbarTrigger } from "./e2e-helpers";

test("crea un tratamiento en el catálogo", async ({ page }) => {
  const suffix = Date.now();
  const treatmentName = `E2E Tratamiento Creado ${suffix}`;

  await page.goto("/treatments");
  await expect(page.getByTestId("treatments-page")).toBeVisible();
  await clickTopbarTrigger(page, "treatment-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nuevo tratamiento" });
  await dialog.getByLabel(/Nombre/).fill(treatmentName);
  await dialog.getByLabel(/Categoría/).fill("Corporal");
  await dialog.getByLabel(/Duración/).fill("45");
  await dialog.getByLabel(/Precio/).fill("99");
  await page.getByTestId("treatment-create-submit").click();

  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await expect(page.getByText("Tratamiento creado.")).toBeVisible();

  await page.getByPlaceholder("Buscar tratamientos...").fill(treatmentName);
  await expect(
    page.getByRole("row", { name: new RegExp(treatmentName) }),
  ).toBeVisible();
});
