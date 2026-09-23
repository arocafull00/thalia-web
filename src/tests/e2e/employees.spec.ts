import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { clickTopbarTrigger, selectComboboxOption } from "./e2e-helpers";

test("invita, edita y cancela una invitación de personal", async ({ page }) => {
  const adminUrl = process.env.E2E_SUPABASE_URL;
  const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;
  test.skip(!adminUrl || !adminKey, "Requiere Supabase local con Edge Functions");

  const admin = createClient(adminUrl!, adminKey!, {
    auth: { persistSession: false },
  });
  const email = `e2e-equipo-${Date.now()}@landora.test`;
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password: "ThaliaE2E123!",
    email_confirm: true,
  });
  expect(createError).toBeNull();
  expect(created.user).not.toBeNull();

  try {
  await page.goto("/employees");
  await expect(page.getByTestId("employees-page")).toBeVisible();
  await clickTopbarTrigger(page, "employee-invite-trigger");

  const inviteDialog = page.getByRole("dialog", { name: "Invitar personal" });
  await inviteDialog.getByLabel(/Email/).fill(email);
  await page.getByTestId("employee-invite-submit").click();
  await expect(inviteDialog).toBeHidden({ timeout: 20_000 });
  await expect(page.getByText("Invitación enviada correctamente.")).toBeVisible();

  await page.getByRole("tab", { name: /Invitaciones pendientes/ }).click();
  const row = page.getByRole("row", { name: new RegExp(email) });
  await expect(row).toBeVisible();
  await row.getByRole("button", { name: "Editar" }).click();

  const editDialog = page.getByRole("dialog", { name: "Editar invitación" });
  await selectComboboxOption(
    page,
    editDialog.getByRole("combobox", { name: "Rol" }),
    "Administrador",
  );
  await editDialog.getByRole("button", { name: "Guardar cambios" }).click();
  await expect(editDialog).toBeHidden({ timeout: 20_000 });
  await expect(row).toContainText("Administrador");

  await row.getByRole("button", { name: "Cancelar invitación" }).click();
  const cancelDialog = page.getByRole("dialog", { name: "Cancelar invitación" });
  await cancelDialog.getByRole("button", { name: "Cancelar invitación" }).click();
  await expect(cancelDialog).toBeHidden({ timeout: 20_000 });
  await expect(row).toHaveCount(0);
  } finally {
    if (created.user) await admin.auth.admin.deleteUser(created.user.id);
  }
});

test("un empleado acepta la invitación y obtiene membresía activa", async ({ page, browser }) => {
  const adminUrl = process.env.E2E_SUPABASE_URL;
  const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;
  test.skip(!adminUrl || !adminKey, "Requiere Supabase local con Edge Functions");
  test.slow();

  const admin = createClient(adminUrl!, adminKey!, {
    auth: { persistSession: false },
  });
  const email = `e2e-aceptacion-${Date.now()}@landora.test`;
  const password = "ThaliaE2E123!";
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: "Empleado Invitado E2E",
      registration_profile_complete: true,
      intended_operational_role: "doctor",
    },
  });
  expect(createError).toBeNull();
  expect(created.user).not.toBeNull();

  const guestContext = await browser.newContext({
    baseURL: process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000",
    storageState: { cookies: [], origins: [] },
  });

  try {
    await page.goto("/employees");
    await expect(page.getByTestId("employees-page")).toBeVisible();
    await clickTopbarTrigger(page, "employee-invite-trigger");
    const inviteDialog = page.getByRole("dialog", { name: "Invitar personal" });
    await inviteDialog.getByLabel(/Email/).fill(email);
    await page.getByTestId("employee-invite-submit").click();
    await expect(inviteDialog).toBeHidden({ timeout: 20_000 });

    const { data: invitation, error: invitationError } = await admin
      .from("invitation_tokens")
      .select("token")
      .eq("clinic_id", "10000000-0000-4000-8000-000000000001")
      .eq("email", email)
      .single();
    expect(invitationError).toBeNull();
    expect(invitation?.token).toBeTruthy();

    const guest = await guestContext.newPage();
    await guest.goto("/login");
    const loginPanel = guest.getByRole("tabpanel", { name: "Iniciar sesión" });
    await loginPanel.getByLabel(/Correo electrónico/).fill(email);
    await loginPanel.getByLabel(/^Contraseña/).fill(password);
    await loginPanel.getByRole("button", { name: "Iniciar sesión", exact: true }).click();
    await expect(guest).not.toHaveURL(/\/login$/, { timeout: 20_000 });

    await guest.goto(`/invite/${invitation!.token}`);
    await expect(guest.getByRole("heading", { name: "Invitación recibida" })).toBeVisible({ timeout: 20_000 });
    await guest.getByRole("button", { name: "Aceptar invitación" }).click();

    await expect.poll(async () => {
      const { data } = await admin
        .from("clinic_memberships")
        .select("role, status")
        .eq("user_id", created.user!.id)
        .eq("clinic_id", "10000000-0000-4000-8000-000000000001")
        .maybeSingle();
      return data;
    }, { timeout: 20_000 }).toMatchObject({ role: "employee", status: "active" });
  } finally {
    await guestContext.close();
    if (created.user) {
      await admin.from("clinic_memberships").delete().eq("user_id", created.user.id);
      await admin.from("employees").delete().eq("id", created.user.id);
      await admin.from("invitation_tokens").delete().eq("email", email);
      await admin.auth.admin.deleteUser(created.user.id);
    }
  }
});
