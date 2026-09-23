import { endOfDay, startOfDay } from "date-fns";
import { create } from "zustand";
import { clinicPersistOptions } from "@/stores/clinic-query-persist";
import { persist } from "zustand/middleware";

import { getTodayAppointments } from "@/dal/dashboard.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import {
  getClinicRangeIso,
  instantToClinicWallDate,
  resolveAppointmentTimezone,
} from "@/lib/appointment-datetime";
import { logger } from "@/lib/logger";
import { useClinicStore } from "@/stores/clinic-store";
import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
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

export const useDashboardStore = create<DashboardStore>()(persist((set, get) => ({
  data: emptyQueryEntry(),

  fetchDashboard: async () => {
    const epoch = getQueryEpoch();
    if (!isCurrentQueryEpoch(epoch)) return;
    set({ data: loadingQueryEntry(get().data) });

    try {
      const timezone = resolveAppointmentTimezone(
        useClinicStore.getState().getActiveMembership()?.clinicTimezone,
      );
      const clinicNow = instantToClinicWallDate(new Date(), timezone);
      const { startIso: todayStart, endIso: todayEnd } = getClinicRangeIso(
        startOfDay(clinicNow),
        endOfDay(clinicNow),
        timezone,
      );

      const clinicId = getActiveClinicId();
      const appointments = await getTodayAppointments(
        todayStart,
        todayEnd,
        clinicId,
      );

      if (!isCurrentQueryEpoch(epoch)) return;
      set({
        data: successQueryEntry({ appointments }, get().data),
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "dashboard-store",
        action: "fetchDashboard",
        clinicId: getActiveClinicId(),
      });
      if (!isCurrentQueryEpoch(epoch)) return;
      set({
        data: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().data,
        ),
      });
    }
  },
}), clinicPersistOptions<DashboardStore>("dashboard", ["data"])));
