import { expect, test } from "@playwright/test";

import { E2E_DATA, E2E_TINY_PNG } from "./e2e-constants";

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
  await page.getByTestId("patient-file-upload-submit").click();

  await expect(
    page
      .getByRole("alert")
      .filter({ hasText: "1 archivo subido correctamente" }),
  ).toBeVisible({ timeout: 20_000 });
  await expect(dialog).toBeHidden({ timeout: 20_000 });
  await expect(page.getByText(fileName)).toBeVisible();
});
