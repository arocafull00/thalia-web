import type { RealtimeChannel } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import { useAppointmentsStore } from "@/stores/appointments-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import type { AppointmentStatus } from "@/types/database.types";

let appointmentsRealtimeChannel: RealtimeChannel | null = null;
let appointmentsRealtimeSubscribers = 0;

export async function refreshAllAppointmentEntries() {
  const { byRange, byPage, fetchAppointments, fetchAppointmentsPage } =
    useAppointmentsStore.getState();
  await Promise.all([
    ...Object.keys(byPage).map((key) => {
      const query = JSON.parse(key) as {
        start: string;
        end: string;
        employeeId: string | null;
        status: AppointmentStatus | null;
        search: string;
        page: number;
        pageSize: number;
      };
      return fetchAppointmentsPage({
        startIso: query.start,
        endIso: query.end,
        employeeId: query.employeeId,
        status: query.status,
        search: query.search,
        page: query.page,
        pageSize: query.pageSize,
      });
    }),
    ...Object.keys(byRange).map((key) => {
      const { start, end, employeeId } = JSON.parse(key) as {
        start: string;
        end: string;
        employeeId: string | null;
      };
      return fetchAppointments({
        start: new Date(start),
        end: new Date(end),
        employeeId,
      });
    }),
  ]);
}

export function subscribeAppointmentsRealtime() {
  appointmentsRealtimeSubscribers += 1;

  if (appointmentsRealtimeChannel) {
    return;
  }

  appointmentsRealtimeChannel = supabase
    .channel("appointments-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "appointments" },
      () => {
        void refreshAllAppointmentEntries();
        void useDashboardStore.getState().fetchDashboard();
      },
    )
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "appointment_treatments" },
      () => {
        void refreshAllAppointmentEntries();
        void useDashboardStore.getState().fetchDashboard();
      },
    )
    .subscribe();
}

export function unsubscribeAppointmentsRealtime() {
  appointmentsRealtimeSubscribers -= 1;

  if (appointmentsRealtimeSubscribers > 0) {
    return;
  }

  if (!appointmentsRealtimeChannel) {
    return;
  }

  supabase.removeChannel(appointmentsRealtimeChannel);
  appointmentsRealtimeChannel = null;
}
