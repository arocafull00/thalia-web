import { expect, test } from "@playwright/test";

import { E2E_DATA } from "./e2e-constants";
import {
  clickPatientTableRow,
  clickTopbarTrigger,
  expectSearchParam,
  openPatientDetailFromEditDialog,
  selectComboboxOption,
} from "./e2e-helpers";

test("crea y edita un paciente con el formulario completo", async ({
  page,
}) => {
  const suffix = Date.now();
  const patientName = `E2E Paciente Creado ${suffix}`;
  const updatedName = `${patientName} Editado`;

  await page.goto("/patients");
  await expect(page.getByTestId("patients-page")).toBeVisible();
  await clickTopbarTrigger(page, "patient-create-trigger");

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

  // Consentimiento de marketing: nace desmarcado y solo se activa a mano.
  const createOptIn = createDialog.getByTestId("patient-marketing-opt-in");
  await expect(createOptIn).not.toBeChecked();
  await createOptIn.check();

  await page.getByTestId("patient-create-submit").click();

  await expect(createDialog).toBeHidden();
  await expect(page.getByText("Paciente creado correctamente.")).toBeVisible();

  await page.getByPlaceholder("Buscar pacientes...").fill(patientName);
  await expectSearchParam(page, "q", patientName);
  await clickPatientTableRow(page, new RegExp(patientName));

  const editDialog = page.getByRole("dialog", { name: "Editar paciente" });
  // El consentimiento sobrevivió al guardado y vuelve marcado desde la BD.
  await expect(
    editDialog.getByTestId("patient-marketing-opt-in"),
  ).toBeChecked();

  await editDialog.getByLabel(/Nombre completo/).fill(updatedName);
  await page.getByTestId("patient-edit-submit").click();

  await expect(editDialog).toBeHidden();
  await expect(
    page.getByText("Paciente actualizado correctamente."),
  ).toBeVisible();

  await page.getByPlaceholder("Buscar pacientes...").fill(updatedName);
  await expectSearchParam(page, "q", updatedName);
  await expect(
    page.getByRole("table").getByRole("row", { name: new RegExp(updatedName) }),
  ).toBeVisible();
});

test("busca, filtra y navega por las pestañas del paciente", async ({
  page,
}) => {
  await page.goto("/patients");
  await expect(page.getByTestId("patients-page")).toBeVisible();
  const search = page.getByPlaceholder("Buscar pacientes...");
  await search.fill(E2E_DATA.filterPatient);
  await expectSearchParam(page, "q", E2E_DATA.filterPatient);
  await expect(
    page.getByRole("row", { name: new RegExp(E2E_DATA.filterPatient) }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("table")
      .getByRole("row", { name: new RegExp(`^${E2E_DATA.patient}\\b`) }),
  ).toHaveCount(0);

  // El paciente de filtro tiene marketing_opt_in = false en la semilla, así que
  // «Activas» lo deja fuera y «No activas» lo devuelve.
  await selectComboboxOption(
    page,
    page.getByTestId("patients-marketing-combobox"),
    "Activas",
  );
  await expectSearchParam(page, "marketing", "granted");
  await expect(
    page.getByRole("table").getByText("No hay pacientes con ese criterio."),
  ).toBeVisible();

  await selectComboboxOption(
    page,
    page.getByTestId("patients-marketing-combobox"),
    "No activas",
  );
  await expectSearchParam(page, "marketing", "denied");
  const patientRow = page.getByRole("row", {
    name: new RegExp(E2E_DATA.filterPatient),
  });
  await expect(patientRow).toBeVisible();

  await search.fill(E2E_DATA.patient);
  await expectSearchParam(page, "q", E2E_DATA.patient);
  await expect(
    page
      .getByRole("table")
      .getByRole("row", { name: new RegExp(E2E_DATA.patient) }),
  ).toBeVisible({ timeout: 15_000 });
  await clickPatientTableRow(page, new RegExp(E2E_DATA.patient));
  await openPatientDetailFromEditDialog(page);
  await expect(page.getByTestId("patient-detail-page")).toBeVisible({
    timeout: 15_000,
  });

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
