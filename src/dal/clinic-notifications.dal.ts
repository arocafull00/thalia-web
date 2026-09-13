import type { RealtimeChannel } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  ClinicNotification,
  ClinicNotificationWithClinic,
} from "@/types/database.types";

export type ClinicNotificationsResult = {
  notifications: ClinicNotificationWithClinic[];
  unreadCount: number;
};

export async function getClinicNotifications(
  clinicId: string,
): Promise<ClinicNotificationsResult> {
  const [notificationsResult, unreadResult] = await Promise.all([
    supabase
      .from("clinic_notifications")
      .select("*, clinics(name)")
      .eq("clinic_id", clinicId)
      .is("resolved_at", null)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("clinic_notifications")
      .select("id", { count: "exact", head: true })
      .eq("clinic_id", clinicId)
      .is("resolved_at", null)
      .is("read_at", null),
  ]);

  const notifications = unwrapSupabaseList(
    notificationsResult.data,
    notificationsResult.error,
  ) as ClinicNotificationWithClinic[];

  if (unreadResult.error) {
    throw unreadResult.error;
  }

  return { notifications, unreadCount: unreadResult.count ?? 0 };
}

export function subscribeClinicNotifications(
  clinicId: string,
  onInsert: (notification: ClinicNotification) => void,
  onChange: () => void,
): RealtimeChannel {
  return supabase
    .channel(`clinic-notifications-${clinicId}`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "clinic_notifications",
        filter: `clinic_id=eq.${clinicId}`,
      },
      (payload) => onInsert(payload.new as ClinicNotification),
    )
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "clinic_notifications",
        filter: `clinic_id=eq.${clinicId}`,
      },
      onChange,
    )
    .subscribe();
}

export function unsubscribeClinicNotifications(channel: RealtimeChannel) {
  return supabase.removeChannel(channel);
}
