import { expect, test, type Page } from "@playwright/test";

import { getDialogField, selectComboboxOption } from "./e2e-helpers";

const tinyPng = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl2nWQAAAAASUVORK5CYII=",
  "base64",
);

async function uploadPatientImage(
  page: Page,
  name: string,
  phase: "Antes" | "Después",
) {
  await page
    .getByRole("button", { name: "Subir imágenes", exact: true })
    .click();
  const dialog = page.getByRole("dialog", { name: "Subir imágenes" });
  await dialog.locator('input[type="file"]').setInputFiles({
    name,
    mimeType: "image/png",
    buffer: tinyPng,
  });
  await selectComboboxOption(page, getDialogField(dialog, "Fase"), phase);
  await dialog
    .getByRole("button", { name: "Subir imágenes", exact: true })
    .click();
  await expect(dialog).toBeHidden();
  await expect(page.getByText(/1 imagen subida correctamente/)).toBeVisible();
}

test("sube imágenes y abre la comparativa before/after", async ({ page }) => {
  await page.goto("/patients/30000000-0000-4000-8000-000000000001");
  await expect(page.getByTestId("patient-detail-page")).toBeVisible();
  await page.getByRole("tab", { name: "Galería", exact: true }).click();
  await expect(page.getByTestId("patient-gallery")).toBeVisible();

  await uploadPatientImage(page, "e2e-before.png", "Antes");
  await uploadPatientImage(page, "e2e-after.png", "Después");

  await expect(
    page.getByRole("button", { name: "Ver imagen: e2e-before.png" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Ver imagen: e2e-after.png" }),
  ).toBeVisible();

  await page
    .getByRole("button", { name: "Crear antes y después", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Seleccionar: e2e-before.png" })
    .click();
  await page
    .getByRole("button", { name: "Seleccionar: e2e-after.png" })
    .click();
  await page
    .getByRole("button", { name: "Comparar seleccionadas", exact: true })
    .click();

  await expect(page.getByTestId("before-after-comparison")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Cerrar comparativa" }),
  ).toBeVisible();
});
