import { expect, type Page, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { E2E_DATA } from "./e2e-constants";
import {
  clickTopbarMenuAction,
  clickTopbarTrigger,
  selectComboboxOption,
  selectFirstAvailableAppointmentSlot,
} from "./e2e-helpers";

async function createAndGoToAppointmentDetail(page: Page): Promise<string> {
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
  await selectFirstAvailableAppointmentSlot(dialog);

  // Intercept the Supabase POST response to capture the new appointment ID directly,
  // avoiding row selection issues when multiple appointments exist in the list.
  const [createResponse] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/rest/v1/appointments") &&
        res.request().method() === "POST",
      { timeout: 15_000 },
    ),
    page.getByTestId("appointment-create-submit").click(),
  ]);

  await expect(page.getByText("Cita creada correctamente.")).toBeVisible({
    timeout: 15_000,
  });
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  const body = (await createResponse.json()) as
    { id: string } | { id: string }[];
  const appointmentId = (Array.isArray(body) ? body[0] : body).id;
  await page.goto(`/appointments/${appointmentId}`);
  await expect(page.getByTestId("appointment-detail-page")).toBeVisible({
    timeout: 15_000,
  });
  return appointmentId;
}

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
  await selectFirstAvailableAppointmentSlot(dialog);
  await dialog.getByLabel("Notas").fill("Cita creada por Playwright.");

  const [createResponse] = await Promise.all([
    page.waitForResponse(
      (res) =>
        res.url().includes("/rest/v1/appointments") &&
        res.request().method() === "POST",
      { timeout: 15_000 },
    ),
    page.getByTestId("appointment-create-submit").click(),
  ]);

  await expect(page.getByText("Cita creada correctamente.")).toBeVisible({
    timeout: 15_000,
  });
  await expect(dialog).toBeHidden({ timeout: 15_000 });

  const body = (await createResponse.json()) as
    { id: string } | { id: string }[];
  const appointmentId = (Array.isArray(body) ? body[0] : body).id;
  await page.goto(`/appointments/${appointmentId}`);

  const detail = page.getByTestId("appointment-detail-page");
  await expect(detail).toBeVisible({ timeout: 15_000 });
  await expect(
    detail.getByRole("link", { name: E2E_DATA.filterPatient, exact: true }),
  ).toBeVisible();
  await expect(
    detail.getByText(E2E_DATA.treatment, { exact: true }),
  ).toBeVisible();
});

test("edita una cita existente", async ({ page }) => {
  await createAndGoToAppointmentDetail(page);

  await clickTopbarMenuAction(page, "Editar cita");

  const editDialog = page.getByRole("dialog", { name: "Editar cita" });
  await expect(editDialog).toBeVisible();
  await editDialog.getByLabel("Notas").fill("Notas editadas por Playwright.");
  await page.getByTestId("appointment-create-submit").click();

  await expect(page.getByText("Cita actualizada correctamente.")).toBeVisible({
    timeout: 15_000,
  });
  await expect(editDialog).toBeHidden({ timeout: 15_000 });
});

test("cancela una cita existente", async ({ page }) => {
  await createAndGoToAppointmentDetail(page);

  await clickTopbarMenuAction(page, "Cancelar cita");

  const confirmDialog = page.getByRole("dialog", { name: "Cancelar cita" });
  await expect(confirmDialog).toBeVisible();
  await confirmDialog
    .getByRole("button", { name: "Confirmar cancelación" })
    .click();

  await expect(confirmDialog).toBeHidden({ timeout: 15_000 });
  await expect(
    page.getByTestId("appointment-detail-page").getByText("Cancelada").first(),
  ).toBeVisible({ timeout: 10_000 });
});

test("elimina una cita nueva", async ({ page }) => {
  await createAndGoToAppointmentDetail(page);

  await clickTopbarMenuAction(page, "Eliminar cita");

  const deleteDialog = page.getByRole("dialog", { name: "Eliminar cita" });
  await expect(deleteDialog).toBeVisible();
  await deleteDialog
    .getByRole("button", { name: "Eliminar definitivamente" })
    .click();

  await expect(page.getByText("Cita eliminada correctamente.")).toBeVisible({
    timeout: 15_000,
  });
  await expect(page).toHaveURL(/\/appointments$/, { timeout: 15_000 });
});

test("completa una cita y enlaza sus movimientos financieros", async ({
  page,
}) => {
  const appointmentId = await createAndGoToAppointmentDetail(page);

  await clickTopbarMenuAction(page, "Confirmar cita");
  await expect(
    page.getByTestId("appointment-detail-page").getByText("Confirmada").first(),
  ).toBeVisible({ timeout: 15_000 });

  await clickTopbarMenuAction(page, "Marcar como completada");
  await expect(
    page.getByTestId("appointment-detail-page").getByText("Completada").first(),
  ).toBeVisible({ timeout: 15_000 });

  await page.goto("/finances");
  const appointmentOrigin = page
    .locator(
      `[data-testid="transaction-appointment-${appointmentId}"]:visible`,
    )
    .first();
  await expect(appointmentOrigin).toBeVisible({ timeout: 15_000 });
  await expect(appointmentOrigin).toHaveText("Cita");

  const transactionRow = page
    .getByRole("row")
    .filter({ has: appointmentOrigin });
  await transactionRow.getByRole("button").first().click();
  await expect(page).toHaveURL(new RegExp(`/appointments/${appointmentId}$`));
});

test("descuenta materiales al completar y repone stock al eliminar", async ({ page }) => {
  const adminUrl = process.env.E2E_SUPABASE_URL;
  const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;
  test.skip(!adminUrl || !adminKey, "Requiere Supabase local");

  const admin = createClient(adminUrl!, adminKey!, {
    auth: { persistSession: false },
  });
  const readStock = async () => {
    const { data, error } = await admin
      .from("inventory_items")
      .select("stock")
      .eq("id", E2E_DATA.inventoryItemId)
      .single();
    if (error) throw error;
    return data.stock;
  };
  const initialStock = await readStock();
  await createAndGoToAppointmentDetail(page);

  await clickTopbarMenuAction(page, "Confirmar cita");
  await expect(page.getByTestId("appointment-detail-page").getByText("Confirmada").first()).toBeVisible();
  await clickTopbarMenuAction(page, "Marcar como completada");
  await expect(page.getByTestId("appointment-detail-page").getByText("Completada").first()).toBeVisible();
  await expect.poll(readStock).toBe(initialStock - 1);

  await clickTopbarMenuAction(page, "Eliminar cita");
  const deleteDialog = page.getByRole("dialog", { name: "Eliminar cita" });
  await deleteDialog.getByRole("checkbox", { name: "Reponer los materiales descontados del stock" }).check();
  await deleteDialog.getByRole("button", { name: "Eliminar definitivamente" }).click();
  await expect(page).toHaveURL(/\/appointments$/, { timeout: 15_000 });
  await expect.poll(readStock).toBe(initialStock);
});
