import { expect, test } from "@playwright/test";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { E2E_DATA } from "./e2e-constants";
import { selectComboboxOption } from "./e2e-helpers";

const adminUrl = process.env.E2E_SUPABASE_URL;
const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;
const clinicId = crypto.randomUUID();
const membershipId = crypto.randomUUID();
const patientId = crypto.randomUUID();
const clinicName = "Clínica E2E Dos";
const patientName = "Paciente Segunda Clínica E2E";
let admin: SupabaseClient | null = null;

test.beforeAll(async () => {
  if (!adminUrl || !adminKey) return;
  admin = createClient(adminUrl, adminKey, {
    auth: { persistSession: false },
  });

  const { error: clinicError } = await admin.from("clinics").insert({
    id: clinicId,
    name: clinicName,
    owner_id: "00000000-0000-4000-8000-000000000001",
  });
  if (clinicError) throw clinicError;

  const { error: billingError } = await admin.from("clinic_billing").upsert({
    clinic_id: clinicId,
    subscription_status: "active",
    current_period_ends_at: new Date(Date.now() + 86_400_000).toISOString(),
  });
  if (billingError) throw billingError;

  const { error: membershipError } = await admin.from("clinic_memberships").insert({
    id: membershipId,
    user_id: "00000000-0000-4000-8000-000000000001",
    clinic_id: clinicId,
    role: "owner",
    status: "active",
  });
  if (membershipError) throw membershipError;

  const { error: patientError } = await admin.from("patients").insert({
    id: patientId,
    clinic_id: clinicId,
    full_name: patientName,
  });
  if (patientError) throw patientError;
});

test.afterAll(async () => {
  if (!admin) return;
  await admin.from("patients").delete().eq("id", patientId);
  await admin.from("clinic_memberships").delete().eq("id", membershipId);
  await admin.from("clinic_billing").delete().eq("clinic_id", clinicId);
  await admin.from("clinics").delete().eq("id", clinicId);
});

test("cambia de clínica sin mostrar datos de la anterior ni abrirlos por URL", async ({ page }) => {
  test.skip(!adminUrl || !adminKey, "Requiere Supabase local");

  await page.goto("/patients");
  await expect(page.getByTestId("patients-page")).toBeVisible();
  await expect(page.getByRole("row", { name: new RegExp(E2E_DATA.patient) })).toBeVisible();

  const selector = page.getByRole("combobox", { name: "Cambiar clínica" });
  await selectComboboxOption(page, selector, clinicName);
  await expect(selector).toContainText(clinicName);
  await expect(page.getByRole("row", { name: new RegExp(patientName) })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("row", { name: new RegExp(E2E_DATA.patient) })).toHaveCount(0);

  await page.goto(`/patients/${E2E_DATA.patientId}`);
  await expect(page.getByTestId("patient-detail-page")).toHaveCount(0);
  await page.goto("/patients");
  await expect(page.getByRole("row", { name: new RegExp(patientName) })).toBeVisible();

  await selectComboboxOption(page, page.getByRole("combobox", { name: "Cambiar clínica" }), E2E_DATA.clinic);
  await expect(page.getByRole("row", { name: new RegExp(E2E_DATA.patient) })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByRole("row", { name: new RegExp(patientName) })).toHaveCount(0);
});
