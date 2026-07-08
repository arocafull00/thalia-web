import { endOfDay, startOfDay } from "date-fns";
import { create } from "zustand";

import { getTodayAppointments } from "@/dal/dashboard.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
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
      const appointments = await getTodayAppointments(
        todayStart,
        todayEnd,
        clinicId,
      );

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
