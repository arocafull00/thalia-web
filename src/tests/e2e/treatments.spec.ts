import { expect, test } from "@playwright/test";

import { clickTopbarMenuAction, clickTopbarTrigger } from "./e2e-helpers";

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

test("edita y elimina un tratamiento creado desde el catálogo", async ({ page }) => {
  const name = `E2E Tratamiento Temporal ${Date.now()}`;
  const updatedName = `${name} Editado`;

  await page.goto("/treatments");
  await expect(page.getByTestId("treatments-page")).toBeVisible();
  await clickTopbarTrigger(page, "treatment-create-trigger");

  const createDialog = page.getByRole("dialog", { name: "Nuevo tratamiento" });
  await createDialog.getByLabel(/Nombre/).fill(name);
  await createDialog.getByLabel(/Categoría/).fill("Facial");
  await createDialog.getByLabel(/Duración/).fill("30");
  await createDialog.getByLabel(/Precio/).fill("65");
  await page.getByTestId("treatment-create-submit").click();
  await expect(createDialog).toBeHidden({ timeout: 15_000 });

  await page.getByPlaceholder("Buscar tratamientos...").fill(name);
  await page.getByRole("row", { name: new RegExp(name) }).getByRole("link", { name }).click();
  await expect(page).toHaveURL(/\/treatments\/[^/]+$/);

  await clickTopbarMenuAction(page, "Editar tratamiento");
  const editDialog = page.getByRole("dialog", { name: "Editar tratamiento" });
  await editDialog.getByLabel(/Nombre/).fill(updatedName);
  await editDialog.getByLabel(/Precio/).fill("80");
  await editDialog.getByTestId("treatment-create-submit").click();
  await expect(editDialog).toBeHidden({ timeout: 15_000 });
  await expect(page.getByText("Tratamiento actualizado.")).toBeVisible();

  await page.reload();
  await expect(page.getByText(updatedName, { exact: true })).toBeVisible();
  await clickTopbarMenuAction(page, "Eliminar tratamiento");
  const deleteDialog = page.getByRole("dialog", { name: "Eliminar tratamiento" });
  await deleteDialog.getByRole("button", { name: "Eliminar", exact: true }).click();
  await expect(page).toHaveURL(/\/treatments$/, { timeout: 15_000 });
  await page.getByPlaceholder("Buscar tratamientos...").fill(updatedName);
  await expect(page.getByRole("row", { name: new RegExp(updatedName) })).toHaveCount(0);
});
