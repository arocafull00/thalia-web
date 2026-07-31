import { expect, test } from "@playwright/test";

import { E2E_DATA } from "./e2e-constants";
import {
  clickTopbarMenuAction,
  clickTopbarTrigger,
  selectComboboxOption,
} from "./e2e-helpers";

test("crea un material en inventario", async ({ page }) => {
  const suffix = Date.now();
  const itemName = `E2E Material Creado ${suffix}`;

  await page.goto("/inventory");
  await expect(page.getByTestId("inventory-page")).toBeVisible();
  await clickTopbarTrigger(page, "inventory-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Añadir material" });
  await dialog.getByLabel(/Nombre/).fill(itemName);
  await dialog.getByLabel(/Categoría/).fill("Consumible");
  await dialog.getByLabel(/Unidad de medida/).fill("unidad");
  await dialog.getByLabel(/Stock inicial/).fill("25");
  await dialog.getByLabel(/Stock mínimo/).fill("5");
  await dialog.getByLabel(/Precio unitario/).fill("3.50");
  await page.getByTestId("inventory-create-submit").click();

  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await expect(page.getByText("Material añadido correctamente.")).toBeVisible();

  await page.getByPlaceholder("Buscar materiales...").fill(itemName);
  await expect(
    page.getByRole("row", { name: new RegExp(itemName) }),
  ).toBeVisible();
});

test("registra un movimiento de entrada en el detalle", async ({ page }) => {
  const notes = `Entrada registrada por Playwright ${Date.now()}.`;

  await page.goto(`/inventory/${E2E_DATA.inventoryItemId}`);
  // La ruta de detalle es un server component que resuelve el material y sus
  // movimientos antes de renderizar; los 5 s por defecto se quedan cortos en
  // un runner frío.
  await expect(page.getByTestId("inventory-detail-page")).toBeVisible({
    timeout: 15_000,
  });
  await clickTopbarTrigger(page, "inventory-movement-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Ajustar stock" });
  await selectComboboxOption(
    page,
    dialog.getByTestId("inventory-movement-type-combobox"),
    "Entrada",
  );
  await dialog.getByLabel(/Cantidad/).fill("5");
  await dialog.getByLabel(/Notas/).fill(notes);
  await page.getByTestId("inventory-movement-create-submit").click();

  await expect(dialog).toBeHidden({ timeout: 15_000 });
  await expect(
    page.getByText("Movimiento registrado correctamente."),
  ).toBeVisible();

  await page.getByRole("tab", { name: "Movimientos", exact: true }).click();
  const movementEntry = page.locator("li").filter({ hasText: notes });
  await expect(movementEntry.getByText("+5 unidad")).toBeVisible();
  await expect(movementEntry.getByText(notes)).toBeVisible();
});

test("edita un material del inventario", async ({ page }) => {
  const newMinStock = String((Date.now() % 90) + 5);

  await page.goto(`/inventory/${E2E_DATA.inventoryItemId}`);
  // La ruta de detalle es un server component que resuelve el material y sus
  // movimientos antes de renderizar; los 5 s por defecto se quedan cortos en
  // un runner frío.
  await expect(page.getByTestId("inventory-detail-page")).toBeVisible({
    timeout: 15_000,
  });

  await clickTopbarMenuAction(page, "Editar material");

  const dialog = page.getByRole("dialog", { name: "Editar material" });
  await expect(dialog).toBeVisible();

  const minStockInput = dialog.getByLabel("Stock mínimo");
  await minStockInput.clear();
  await minStockInput.fill(newMinStock);
  await page.getByTestId("inventory-edit-submit").click();

  await expect(
    page.getByText("Material actualizado correctamente."),
  ).toBeVisible({ timeout: 15_000 });
  await expect(dialog).toBeHidden({ timeout: 15_000 });
});
