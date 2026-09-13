import "server-only";

import { createClient } from "@/lib/supabase/server";

export async function markClinicNotificationsAsRead(
  clinicId: string,
  recipientId: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("clinic_notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("clinic_id", clinicId)
    .eq("recipient_id", recipientId)
    .is("resolved_at", null)
    .is("read_at", null);

  if (error) {
    throw error;
  }
}
