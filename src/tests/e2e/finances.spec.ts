import { readFile } from "node:fs/promises";

import { expect, test } from "@playwright/test";
import { format } from "date-fns";

import { clickTopbarTrigger } from "./e2e-helpers";

test("crea un ingreso", async ({ page }) => {
  const suffix = Date.now();
  const description = `E2E Ingreso ${suffix}`;
  const category = `E2E Categoría ${suffix}`;
  const today = format(new Date(), "yyyy-MM-dd");

  await page.goto("/finances");
  await expect(page.getByTestId("finances-page")).toBeVisible();
  await clickTopbarTrigger(page, "transaction-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nuevo movimiento" });
  await dialog.getByTestId("transaction-category-create-trigger").click();

  const categoryDialog = page.getByRole("dialog", {
    name: "Nueva categoría",
  });
  await categoryDialog.getByLabel("Nombre").fill(category);
  await categoryDialog.getByRole("button", { name: "Guardar" }).click();

  await expect(categoryDialog).toBeHidden({ timeout: 15_000 });
  await expect(page.getByTestId("transaction-category-combobox")).toHaveText(
    category,
    { timeout: 15_000 },
  );
  await expect(page.getByText("Categoría creada correctamente.")).toBeVisible({
    timeout: 15_000,
  });

  await dialog.getByLabel(/Importe/).fill("120.50");
  await dialog.getByLabel("Editar fecha manualmente").fill(today);
  await dialog.getByLabel(/Descripción/).fill(description);
  await page.getByTestId("transaction-create-submit").click();

  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await expect(
    page.getByText("Movimiento creado correctamente."),
  ).toBeVisible();

  /*
   * La pantalla abre en «Resumen», que no lleva listado ni buscador: el
   * movimiento recién creado solo es visible desde «Movimientos».
   */
  await page.getByRole("tab", { name: "Movimientos" }).click();

  await page.getByPlaceholder("Buscar por concepto...").fill(description);
  await expect(
    page.getByRole("row", { name: new RegExp(description) }),
  ).toBeVisible();
  await expect(
    page.getByRole("row", { name: new RegExp(category) }),
  ).toBeVisible();
});

test("exporta los cobros filtrados a un CSV compatible", async ({ page }) => {
  const suffix = Date.now();
  const description = `E2E Exportación ${suffix}`;
  const category = `E2E Gestoría ${suffix}`;
  const today = format(new Date(), "yyyy-MM-dd");

  await page.goto("/finances");
  await expect(page.getByTestId("finances-page")).toBeVisible();
  await clickTopbarTrigger(page, "transaction-create-trigger");

  const createDialog = page.getByRole("dialog", { name: "Nuevo movimiento" });
  await createDialog.getByTestId("transaction-category-create-trigger").click();

  const categoryDialog = page.getByRole("dialog", {
    name: "Nueva categoría",
  });
  await categoryDialog.getByLabel("Nombre").fill(category);
  await categoryDialog.getByRole("button", { name: "Guardar" }).click();
  await expect(categoryDialog).toBeHidden({ timeout: 15_000 });

  await createDialog.getByLabel(/Importe/).fill("245.75");
  await createDialog.getByLabel("Editar fecha manualmente").fill(today);
  await createDialog.getByLabel(/Descripción/).fill(description);
  await page.getByTestId("transaction-create-submit").click();
  await expect(createDialog).toBeHidden({ timeout: 15_000 });

  await clickTopbarTrigger(page, "finances-export-trigger");
  const exportDialog = page.getByRole("dialog", {
    name: "Exportar información financiera",
  });
  await exportDialog.getByRole("checkbox", { name: category }).click();
  await exportDialog.getByLabel("Desde").fill(today);
  await exportDialog.getByLabel("Hasta").fill(today);

  const downloadPromise = page.waitForEvent("download");
  await exportDialog.getByTestId("finances-export-submit").click();
  const download = await downloadPromise;
  const path = await download.path();

  expect(path).not.toBeNull();
  expect(download.suggestedFilename()).toBe(`finanzas_${today}_a_${today}.csv`);
  const csv = await readFile(path!, "utf8");
  expect(csv).toContain(
    '\uFEFF"Fecha";"Tipo";"Categoría";"Concepto";"Importe (€)"',
  );
  expect(csv).toContain(`"Cobro";"${category}";"${description}";245,75`);
  await expect(exportDialog).toBeHidden();
});
