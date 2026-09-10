import path from "node:path";

import { expect, test } from "@playwright/test";

import { E2E_DATA } from "./e2e-constants";

/*
 * El autónomo sólo ve los pacientes de sus propias citas (#102).
 *
 * El filtro no está en el DAL sino en RLS, así que esta comprobación cubre a la
 * vez el listado, el recuento, la búsqueda y el acceso directo por URL. Se
 * ejecuta con la sesión del autónomo, no con la del administrador.
 */
test.use({
  storageState: path.join("src", "tests", "e2e", ".auth", "external.json"),
});

test("solo lista los pacientes de sus citas", async ({ page }) => {
  await page.goto("/patients");
  await expect(page.getByTestId("patients-page")).toBeVisible({
    timeout: 20_000,
  });

  const table = page.getByRole("table");

  // El seed le da una única cita, con el paciente base.
  await expect(
    table.getByRole("row", { name: new RegExp(E2E_DATA.patient) }),
  ).toBeVisible();

  // Y el resto del censo de la clínica no debe aparecer.
  await expect(
    table.getByRole("row", { name: new RegExp(E2E_DATA.filterPatient) }),
  ).toHaveCount(0);
});

test("no llega al detalle de un paciente ajeno por URL directa", async ({
  page,
}) => {
  // El id es el de "E2E Paciente Filtro", que no tiene ninguna cita con él.
  await page.goto("/patients/30000000-0000-4000-8000-000000000002");

  /*
   * Se comprueba el contenido y no el código HTTP: el layout ya se ha volcado
   * cuando el Server Component llama a `notFound()`, así que Next ya no puede
   * cambiar la cabecera y la respuesta sigue siendo 200 aunque pinte el "no
   * encontrado". Lo que importa es que no se filtre el paciente.
   */
  await expect(page.getByText(E2E_DATA.filterPatient)).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: /could not be found|no se encontr/i }),
  ).toBeVisible({ timeout: 15_000 });
});
