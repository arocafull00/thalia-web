import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { AppointmentReminder } from "@/types/database.types";

export async function getRemindersForAppointment(
  appointmentId: string,
): Promise<AppointmentReminder[]> {
  const { data, error } = await supabase
    .from("appointment_reminders")
    .select("*")
    .eq("appointment_id", appointmentId)
    .order("sent_at", { ascending: false });

  return unwrapSupabaseList(data, error);
}

/**
 * Desenlace de una ejecución de `send-reminders` (#85).
 *
 * La función responde 200 aunque no haya enviado nada —la clínica no tiene
 * número, el paciente no tiene teléfono, la cita se salió de la ventana—, así
 * que sin mirar el cuerpo la interfaz diría "enviado" siempre.
 */
export type ReminderRunSummary = {
  trigger: "manual" | "cron";
  clinicsMatched: number;
  appointmentsScanned: number;
  sent: number;
  failed: number;
  skipped: Record<string, number>;
};

export async function sendManualReminder(
  appointmentId: string,
  clinicId: string,
): Promise<ReminderRunSummary> {
  const { data, error } = await supabase.functions.invoke("send-reminders", {
    body: { appointmentId, clinicId, manual: true },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as ReminderRunSummary;
}

/** Primer motivo por el que no salió, para poder decírselo a quien pulsó. */
export function firstSkipReason(
  summary: ReminderRunSummary | null,
): string | null {
  if (!summary) return null;
  if (summary.clinicsMatched === 0) return "clinica_no_elegible";

  return Object.keys(summary.skipped)[0] ?? null;
}

export async function getClinicReminderSettings(clinicId: string) {
  const { data, error } = await supabase
    .from("clinics")
    .select(
      "whatsapp_reminder_enabled, whatsapp_reminder_hours, whatsapp_phone_number_id, whatsapp_message_template, whatsapp_confirmation_enabled",
    )
    .eq("id", clinicId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export type ClinicReminderSettingsUpdate = {
  whatsapp_reminder_enabled: boolean;
  whatsapp_reminder_hours: number[];
  whatsapp_phone_number_id: string | null;
  whatsapp_message_template: string;
  whatsapp_confirmation_enabled: boolean;
};

export async function updateClinicReminderSettings(
  clinicId: string,
  settings: ClinicReminderSettingsUpdate,
): Promise<void> {
  const { error } = await supabase
    .from("clinics")
    .update(settings)
    .eq("id", clinicId);

  if (error) {
    throw new Error(error.message);
  }
}
