import path from "node:path";

import { expect, test } from "@playwright/test";
import { addDays, format } from "date-fns";

import { E2E_DATA } from "./e2e-constants";

/*
 * El autónomo solo ve las citas en las que es el profesional asignado (#99).
 *
 * Igual que en #102, el filtro vive en RLS y no en los hooks, así que esto
 * cubre a la vez el listado, el recuento y la vista `appointments_search`.
 */
test.use({
  storageState: path.join("src", "tests", "e2e", ".auth", "external.json"),
});

test("no ve en el listado las citas de otros profesionales", async ({
  page,
}) => {
  // El rango por defecto es la semana en curso, donde el seed solo tiene la
  // cita del administrador. El autónomo no debe encontrarla.
  await page.goto("/appointments");
  await expect(page.getByTestId("appointments-page")).toBeVisible({
    timeout: 20_000,
  });

  await expect(
    page.getByRole("row", { name: new RegExp(E2E_DATA.patient) }),
  ).toHaveCount(0);
});

test("sí ve su propia cita cuando el rango la incluye", async ({ page }) => {
  // La suya está a +90 días, fuera del rango por defecto.
  const from = format(new Date(), "yyyy-MM-dd");
  const to = format(addDays(new Date(), 120), "yyyy-MM-dd");

  await page.goto(`/appointments?from=${from}&to=${to}`);
  await expect(page.getByTestId("appointments-page")).toBeVisible({
    timeout: 20_000,
  });

  // Su única cita es con el paciente base, así que ahí sí debe aparecer.
  await expect(
    page.getByRole("row", { name: new RegExp(E2E_DATA.patient) }),
  ).toBeVisible();
});

test("no le ofrece filtrar por profesional", async ({ page }) => {
  // Filtrar por otro profesional solo podría vaciarle la lista: no tiene
  // acceso a ninguna agenda salvo la suya.
  await page.goto("/appointments");
  await expect(page.getByTestId("appointments-page")).toBeVisible({
    timeout: 20_000,
  });

  await expect(page.getByText("Profesional", { exact: true })).toHaveCount(0);
});
