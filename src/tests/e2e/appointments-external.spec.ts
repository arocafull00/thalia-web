import path from "node:path";

import { expect, test } from "@playwright/test";
import { addDays, format } from "date-fns";
import { createClient } from "@supabase/supabase-js";

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

test("acepta y rechaza citas asignadas y guarda ambos estados", async ({ page }) => {
  const adminUrl = process.env.E2E_SUPABASE_URL;
  const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;
  test.skip(!adminUrl || !adminKey, "Requiere Supabase local");

  const admin = createClient(adminUrl!, adminKey!, {
    auth: { persistSession: false },
  });
  const patientIds = [crypto.randomUUID(), crypto.randomUUID()];
  const appointmentIds = [crypto.randomUUID(), crypto.randomUUID()];
  const names = [`E2E Aceptar ${Date.now()}`, `E2E Rechazar ${Date.now()}`];
  const start = addDays(new Date(), 110);
  start.setHours(10, 0, 0, 0);

  try {
    const { error: patientError } = await admin.from("patients").insert(
      patientIds.map((id, index) => ({
        id,
        clinic_id: E2E_DATA.clinicId,
        full_name: names[index],
      })),
    );
    expect(patientError).toBeNull();

    const { error: appointmentError } = await admin.from("appointments").insert(
      appointmentIds.map((id, index) => {
        const startsAt = addDays(start, index);
        return {
          id,
          clinic_id: E2E_DATA.clinicId,
          patient_id: patientIds[index],
          employee_id: "00000000-0000-4000-8000-0000000000ff",
          starts_at: startsAt.toISOString(),
          ends_at: new Date(startsAt.getTime() + 30 * 60_000).toISOString(),
          status: "pending_external",
        };
      }),
    );
    expect(appointmentError).toBeNull();

    const from = format(addDays(start, -1), "yyyy-MM-dd");
    const to = format(addDays(start, 3), "yyyy-MM-dd");
    await page.goto(`/appointments?from=${from}&to=${to}`);
    await expect(page.getByTestId("appointments-page")).toBeVisible();

    const acceptRow = page.getByRole("row", { name: new RegExp(names[0]) });
    await acceptRow.getByRole("button", { name: "Aceptar el hueco de esta cita" }).click();
    await expect(page.getByText("Cita aceptada.")).toBeVisible();

    const rejectRow = page.getByRole("row", { name: new RegExp(names[1]) });
    await rejectRow.getByRole("button", { name: "Rechazar el hueco de esta cita" }).click();
    const rejectDialog = page.getByRole("dialog", { name: "¿Rechazar esta cita?" });
    await rejectDialog.getByRole("button", { name: "Rechazar", exact: true }).click();
    await expect(page.getByText("Cita rechazada.")).toBeVisible();

    const { data: appointments, error: readError } = await admin
      .from("appointments")
      .select("id, status")
      .in("id", appointmentIds);
    expect(readError).toBeNull();
    expect(appointments).toEqual(expect.arrayContaining([
      { id: appointmentIds[0], status: "scheduled" },
      { id: appointmentIds[1], status: "rejected_external" },
    ]));
  } finally {
    await admin.from("appointments").delete().in("id", appointmentIds);
    await admin.from("patients").delete().in("id", patientIds);
  }
});
