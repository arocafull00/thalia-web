import { expect, test } from "@playwright/test";

import { E2E_DATA, E2E_TINY_PNG } from "./e2e-constants";
import { selectComboboxOption } from "./e2e-helpers";

test("sube un archivo al paciente seed", async ({ page }) => {
  const fileName = `e2e-file-${Date.now()}.png`;

  await page.goto(`/patients/${E2E_DATA.patientId}`);
  await expect(page.getByTestId("patient-detail-page")).toBeVisible();
  await page.getByRole("tab", { name: "Archivos", exact: true }).click();
  await page.getByTestId("patient-file-upload-trigger").click();

  const dialog = page.getByRole("dialog", { name: "Subir archivo" });
  await dialog.locator('input[type="file"]').setInputFiles({
    name: fileName,
    mimeType: "image/png",
    buffer: E2E_TINY_PNG,
  });
  await selectComboboxOption(
    page,
    dialog.getByRole("combobox", { name: /Categoría/ }),
    "Otro",
  );
  await page.getByTestId("patient-file-upload-submit").click();

  await expect(page.getByText("1 archivo subido correctamente")).toBeVisible({
    timeout: 20_000,
  });
  await expect(dialog).toBeHidden({ timeout: 20_000 });
  await expect(page.getByText(fileName)).toBeVisible();
});

test("visualiza, descarga, edita y elimina un archivo del paciente", async ({ page }) => {
  const fileName = `e2e-file-lifecycle-${Date.now()}.png`;
  const notes = `Nota E2E ${Date.now()}`;

  await page.goto(`/patients/${E2E_DATA.patientId}`);
  await expect(page.getByTestId("patient-detail-page")).toBeVisible();
  await page.getByRole("tab", { name: "Archivos", exact: true }).click();
  await page.getByTestId("patient-file-upload-trigger").click();

  const uploadDialog = page.getByRole("dialog", { name: "Subir archivo" });
  await uploadDialog.locator('input[type="file"]').setInputFiles({
    name: fileName,
    mimeType: "image/png",
    buffer: E2E_TINY_PNG,
  });
  await selectComboboxOption(
    page,
    uploadDialog.getByRole("combobox", { name: /Categoría/ }),
    "Otro",
  );
  await page.getByTestId("patient-file-upload-submit").click();
  await expect(uploadDialog).toBeHidden({ timeout: 20_000 });

  const fileButton = page.getByRole("button", { name: new RegExp(fileName) });
  await expect(fileButton).toBeVisible();
  await fileButton.click();
  const viewer = page.getByRole("dialog");
  await expect(viewer.getByRole("img", { name: fileName })).toBeVisible();
  const downloadPromise = page.waitForEvent("download");
  await viewer.getByRole("button", { name: "Descargar" }).click();
  expect((await downloadPromise).suggestedFilename()).toBe(fileName);
  await viewer.getByRole("button", { name: "Cerrar visor" }).click();

  await fileButton.locator("..").getByRole("button", { name: "Acciones del archivo" }).click();
  await page.getByRole("menuitem", { name: "Editar" }).click();
  const editDialog = page.getByRole("dialog", { name: "Editar archivo" });
  await editDialog.getByLabel("Notas").fill(notes);
  await editDialog.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(editDialog).toBeHidden({ timeout: 15_000 });
  await expect(page.getByText(notes)).toBeVisible();

  await page.reload();
  await page.getByRole("tab", { name: "Archivos", exact: true }).click();
  await expect(page.getByText(notes)).toBeVisible();
  await page.getByRole("button", { name: new RegExp(fileName) }).locator("..").getByRole("button", { name: "Acciones del archivo" }).click();
  await page.getByRole("menuitem", { name: "Eliminar" }).click();
  const deleteDialog = page.getByRole("dialog", { name: "Eliminar archivo" });
  await deleteDialog.getByRole("button", { name: "Eliminar", exact: true }).click();
  await expect(deleteDialog).toBeHidden({ timeout: 15_000 });
  await expect(page.getByRole("button", { name: new RegExp(fileName) })).toHaveCount(0);
});
