import { expect, test } from "@playwright/test";

import { E2E_DATA } from "./e2e-constants";
import {
  clickTopbarTrigger,
  selectComboboxOption,
  selectFirstAvailableAppointmentSlot,
} from "./e2e-helpers";

test("crea una cita y abre su detalle", async ({ page }) => {
  await page.goto("/appointments");
  await expect(page.getByTestId("appointments-page")).toBeVisible();
  await clickTopbarTrigger(page, "appointment-create-trigger");

  const dialog = page.getByRole("dialog", { name: "Nueva cita" });
  await selectComboboxOption(
    page,
    dialog.getByTestId("appointment-patient-combobox"),
    E2E_DATA.filterPatient,
  );
  await selectComboboxOption(
    page,
    dialog.getByTestId("appointment-employee-combobox"),
    E2E_DATA.employee,
  );
  await dialog
    .getByRole("checkbox", { name: E2E_DATA.treatment, exact: true })
    .click();
  const slotTime = await selectFirstAvailableAppointmentSlot(dialog);
  await dialog.getByLabel("Notas").fill("Cita creada por Playwright.");
  await page.getByTestId("appointment-create-submit").click();

  await expect(page.getByText("Cita creada correctamente.")).toBeVisible({
    timeout: 15_000,
  });
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  const row = page.getByRole("row", {
    name: new RegExp(
      `${slotTime}.*${E2E_DATA.filterPatient}.*${E2E_DATA.treatment}`,
    ),
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
