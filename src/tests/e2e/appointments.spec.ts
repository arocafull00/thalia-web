import { expect, test } from "@playwright/test";

import { E2E_DATA } from "./e2e-constants";
import { getDialogField, selectComboboxOption } from "./e2e-helpers";

test("crea una cita y abre su detalle", async ({ page }) => {
  await page.goto("/appointments");
  await expect(page.getByTestId("appointments-page")).toBeVisible();
  await page
    .locator("header")
    .getByRole("button", { name: "Nueva cita", exact: true })
    .click();

  const dialog = page.getByRole("dialog", { name: "Nueva cita" });
  await selectComboboxOption(
    page,
    getDialogField(dialog, "Paciente"),
    E2E_DATA.filterPatient,
  );
  await selectComboboxOption(
    page,
    getDialogField(dialog, "Profesional"),
    E2E_DATA.employee,
  );
  await dialog
    .getByRole("checkbox", { name: E2E_DATA.treatment, exact: true })
    .click();
  await dialog.getByLabel("Notas").fill("Cita creada por Playwright.");
  await dialog.getByRole("button", { name: "Guardar", exact: true }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText("Cita creada correctamente.")).toBeVisible();

  const row = page.getByRole("row", {
    name: new RegExp(`${E2E_DATA.filterPatient}.*${E2E_DATA.treatment}`),
  });
  await expect(row).toBeVisible();
  await row.click();

  await expect(page.getByTestId("appointment-detail-page")).toBeVisible();
  await expect(
    page.getByRole("link", { name: E2E_DATA.filterPatient, exact: true }),
  ).toBeVisible();
  await expect(
    page.getByText(E2E_DATA.treatment, { exact: true }),
  ).toBeVisible();
});
