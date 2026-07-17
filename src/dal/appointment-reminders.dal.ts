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

export async function sendManualReminder(
  appointmentId: string,
  clinicId: string,
): Promise<void> {
  const { error } = await supabase.functions.invoke("send-reminders", {
    body: { appointmentId, clinicId, manual: true },
  });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getClinicReminderSettings(clinicId: string) {
  const { data, error } = await supabase
    .from("clinics")
    .select(
      "whatsapp_reminder_enabled, whatsapp_reminder_hours, whatsapp_phone_number_id, whatsapp_message_template",
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
