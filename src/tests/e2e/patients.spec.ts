import { expect, test } from "@playwright/test";

import { E2E_DATA } from "./e2e-constants";

test("crea y edita un paciente con el formulario completo", async ({
  page,
}) => {
  const suffix = Date.now();
  const patientName = `E2E Paciente Creado ${suffix}`;
  const updatedName = `${patientName} Editado`;

  await page.goto("/patients");
  await expect(page.getByTestId("patients-page")).toBeVisible();
  await page
    .locator("header")
    .getByRole("button", { name: "Nuevo paciente", exact: true })
    .click();

  const createDialog = page.getByRole("dialog", { name: "Nuevo paciente" });
  await createDialog.getByLabel(/Nombre completo/).fill(patientName);
  await createDialog.getByLabel(/Teléfono/).fill("+34620000000");
  await createDialog
    .getByLabel("Email")
    .fill(`paciente-${suffix}@landora.test`);
  await createDialog.getByLabel("DNI").fill("12345678Z");
  await createDialog.getByLabel("Editar fecha manualmente").fill("1994-03-21");
  await createDialog.getByLabel(/Dirección/).fill("Calle E2E 73");
  await createDialog
    .getByLabel("Notas")
    .fill("Paciente creado por Playwright.");
  await createDialog
    .getByRole("button", { name: "Guardar", exact: true })
    .click();

  await expect(createDialog).toBeHidden();
  await expect(page.getByText("Paciente creado correctamente.")).toBeVisible();

  await page.getByPlaceholder("Buscar pacientes...").fill(patientName);
  const patientRow = page.getByRole("row", { name: new RegExp(patientName) });
  await expect(patientRow).toBeVisible();
  await patientRow.click();

  await expect(page.getByTestId("patient-detail-page")).toBeVisible();
  await expect(page.getByRole("heading", { name: patientName })).toBeVisible();
  await page
    .getByRole("button", { name: "Editar paciente", exact: true })
    .click();

  const editDialog = page.getByRole("dialog", { name: "Editar paciente" });
  await editDialog.getByLabel(/Nombre completo/).fill(updatedName);
  await editDialog
    .getByRole("button", { name: "Guardar cambios", exact: true })
    .click();

  await expect(editDialog).toBeHidden();
  await expect(page.getByRole("heading", { name: updatedName })).toBeVisible();
});

test("busca, filtra y navega por las pestañas del paciente", async ({
  page,
}) => {
  await page.goto("/patients");
  await expect(page.getByTestId("patients-page")).toBeVisible();
  const search = page.getByPlaceholder("Buscar pacientes...");
  await search.fill(E2E_DATA.filterPatient);

  await expect(
    page.getByRole("row", { name: new RegExp(E2E_DATA.filterPatient) }),
  ).toBeVisible();
  await expect(page.getByText(E2E_DATA.patient, { exact: true })).toBeHidden();

  await page.getByRole("button", { name: "Todos", exact: true }).click();
  await page.getByRole("option", { name: "Inactivos", exact: true }).click();
  await expect(
    page.getByText("No hay pacientes con ese criterio."),
  ).toBeVisible();

  await page.getByRole("button", { name: "Inactivos", exact: true }).click();
  await page.getByRole("option", { name: "Activos", exact: true }).click();
  const patientRow = page.getByRole("row", {
    name: new RegExp(E2E_DATA.filterPatient),
  });
  await expect(patientRow).toBeVisible();

  await search.fill(E2E_DATA.patient);
  const basePatientRow = page.getByRole("row", {
    name: new RegExp(E2E_DATA.patient),
  });
  await basePatientRow.click();
  await expect(page.getByTestId("patient-detail-page")).toBeVisible();

  for (const tabName of [
    "Resumen",
    "Historial clínico",
    "Tratamientos",
    "Citas",
    "Galería",
    "Archivos",
  ]) {
    const tab = page.getByRole("tab", { name: tabName, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute("aria-selected", "true");
  }
});
