import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

import { E2E_DATA } from "./e2e-constants";

test("valida y guarda la configuración de recordatorios con confirmación", async ({ page }) => {
  const adminUrl = process.env.E2E_SUPABASE_URL;
  const adminKey = process.env.E2E_SUPABASE_SECRET_KEY;
  test.skip(!adminUrl || !adminKey, "Requiere Supabase local");

  const admin = createClient(adminUrl!, adminKey!, {
    auth: { persistSession: false },
  });
  const { data: original, error: readError } = await admin
    .from("whatsapp_config")
    .select("reminder_enabled, reminder_hours, phone_number_id, message_template, confirmation_enabled")
    .eq("clinic_id", E2E_DATA.clinicId)
    .maybeSingle();
  expect(readError).toBeNull();

  try {
    await page.goto("/settings/clinica");
    const settings = page.getByRole("region", { name: "Servicios de la clínica" });
    await expect(settings).toBeVisible();

    const reminderSwitch = settings.getByRole("switch", {
      name: "Activar recordatorios automáticos (WhatsApp)",
    });
    if ((await reminderSwitch.getAttribute("aria-checked")) === "false") {
      await reminderSwitch.click();
    }
    const confirmationSwitch = settings.getByRole("switch", {
      name: "Pedir confirmación en el recordatorio",
    });
    if ((await confirmationSwitch.getAttribute("aria-checked")) === "false") {
      await confirmationSwitch.click();
    }

    await settings.getByRole("radio", { name: "12h antes" }).click();
    await settings.getByLabel("Mensaje").fill("Hola {paciente}, tu cita es el {fecha}.");
    await settings.getByRole("button", { name: "Guardar" }).click();
    await expect(settings.getByText("Añade {enlace} al mensaje o el paciente no podrá confirmar.")).toBeVisible();

    const message = "Hola {paciente}, confirma tu cita del {fecha}: {enlace}";
    await settings.getByLabel("Mensaje").fill(message);
    await settings.getByRole("button", { name: "Guardar" }).click();
    await expect(page.getByText("Configuración de WhatsApp guardada.")).toBeVisible();

    await page.reload();
    const reloaded = page.getByRole("region", { name: "Servicios de la clínica" });
    await expect(reloaded.getByRole("switch", { name: "Activar recordatorios automáticos (WhatsApp)" })).toHaveAttribute("aria-checked", "true");
    await expect(reloaded.getByRole("switch", { name: "Pedir confirmación en el recordatorio" })).toHaveAttribute("aria-checked", "true");
    await expect(reloaded.getByRole("radio", { name: "12h antes" })).toHaveAttribute("aria-checked", "true");
    await expect(reloaded.getByLabel("Mensaje")).toHaveValue(message);
  } finally {
    if (original) {
      await admin.from("whatsapp_config").update(original).eq("clinic_id", E2E_DATA.clinicId);
    } else {
      await admin.from("whatsapp_config").delete().eq("clinic_id", E2E_DATA.clinicId);
    }
  }
});
