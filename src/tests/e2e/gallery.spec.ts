import { expect, test, type Page } from "@playwright/test";

import { E2E_DATA, E2E_TINY_PNG } from "./e2e-constants";
import { selectComboboxOption } from "./e2e-helpers";

async function uploadPatientImage(
  page: Page,
  name: string,
  phase: "Antes" | "Después",
) {
  await page.getByTestId("patient-gallery-upload-trigger").click();
  const dialog = page.getByRole("dialog", { name: "Subir imágenes" });
  await dialog.locator('input[type="file"]').setInputFiles({
    name,
    mimeType: "image/png",
    buffer: E2E_TINY_PNG,
  });
  await selectComboboxOption(
    page,
    dialog.getByTestId("patient-image-phase-combobox"),
    phase,
  );
  await page.getByTestId("patient-gallery-upload-submit").click();

  const successToast = page
    .getByRole("alert")
    .filter({ hasText: "1 imagen subida correctamente" })
    .last();
  await expect(successToast).toBeVisible({ timeout: 15_000 });
  await expect(dialog).toBeHidden({ timeout: 15_000 });
}

test("sube imágenes y abre la comparativa before/after", async ({ page }) => {
  const suffix = Date.now();
  const beforeName = `e2e-before-${suffix}.png`;
  const afterName = `e2e-after-${suffix}.png`;

  await page.goto(`/patients/${E2E_DATA.patientId}`);
  await expect(page.getByTestId("patient-detail-page")).toBeVisible();
  await page.getByRole("tab", { name: "Galería", exact: true }).click();
  await expect(page.getByTestId("patient-gallery")).toBeVisible();

  await uploadPatientImage(page, beforeName, "Antes");
  await uploadPatientImage(page, afterName, "Después");

  await expect(
    page.getByRole("button", { name: `Ver imagen: ${beforeName}` }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: `Ver imagen: ${afterName}` }),
  ).toBeVisible();

  await page.getByTestId("patient-gallery-before-after-trigger").click();
  await page
    .getByRole("button", { name: `Seleccionar: ${beforeName}` })
    .click();
  await page.getByRole("button", { name: `Seleccionar: ${afterName}` }).click();
  await page.getByTestId("patient-gallery-compare-trigger").click();

  await expect(page.getByTestId("before-after-comparison")).toBeVisible();
  await expect(
    page.getByTestId("patient-gallery-comparison-close"),
  ).toBeVisible();
});
