import { endOfDay, startOfDay } from "date-fns";
import { create } from "zustand";

import { getActiveClinicId } from "@/lib/active-clinic-id";
import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { AppointmentWithRelations } from "@/types/database.types";

export type DashboardData = {
  appointments: AppointmentWithRelations[];
};

type DashboardStore = {
  data: QueryEntry<DashboardData>;
  fetchDashboard: () => Promise<void>;
};

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  data: emptyQueryEntry(),

  fetchDashboard: async () => {
    set({ data: loadingQueryEntry(get().data) });

    try {
      const todayStart = startOfDay(new Date()).toISOString();
      const todayEnd = endOfDay(new Date()).toISOString();

      const clinicId = getActiveClinicId();
      let appointmentsQuery = supabase
        .from("appointments")
        .select(
          "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_treatments(*, treatment_types(id, name, color, price))",
        )
        .gte("starts_at", todayStart)
        .lte("starts_at", todayEnd)
        .order("starts_at");

      if (clinicId) {
        appointmentsQuery = appointmentsQuery.eq("clinic_id", clinicId);
      }

      const appointmentsResponse = await appointmentsQuery;

      const appointments = unwrapSupabaseList(
        appointmentsResponse.data,
        appointmentsResponse.error,
      ) as AppointmentWithRelations[];

      set({
        data: successQueryEntry({
          appointments,
        }),
      });
    } catch (cause) {
      set({
        data: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().data,
        ),
      });
    }
  },
}));
