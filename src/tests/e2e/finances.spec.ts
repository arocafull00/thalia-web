import { expect, test } from "@playwright/test";
import { format } from "date-fns";

import { clickTopbarTrigger, selectComboboxOption } from "./e2e-helpers";

test("crea un ingreso", async ({ page }) => {
  const suffix = Date.now();
  const description = `E2E Ingreso ${suffix}`;
  const category = "Productos";
  const today = format(new Date(), "yyyy-MM-dd");

  await page.goto("/finances");
  await expect(page.getByTestId("finances-page")).toBeVisible();
  await clickTopbarTrigger(page, "transaction-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nuevo movimiento" });
  await dialog.getByLabel(/Importe/).fill("120.50");
  await dialog.getByLabel("Editar fecha manualmente").fill(today);
  await selectComboboxOption(
    page,
    dialog.getByTestId("transaction-category-combobox"),
    category,
  );
  await dialog.getByLabel(/Descripción/).fill(description);
  await page.getByTestId("transaction-create-submit").click();

  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await expect(
    page.getByText("Movimiento creado correctamente."),
  ).toBeVisible();

  await page.getByPlaceholder("Buscar por concepto...").fill(description);
  await expect(
    page.getByRole("row", { name: new RegExp(description) }),
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: new RegExp(category) }),
  ).toBeVisible();
});
