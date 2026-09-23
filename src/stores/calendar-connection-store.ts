import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getGoogleCalendarConnection } from "@/dal/google-calendar.dal";
import { logger } from "@/lib/logger";
import { clinicPersistOptions } from "@/stores/clinic-query-persist";
import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
import { errorQueryEntry, loadingQueryEntry, successQueryEntry, type QueryEntry } from "@/stores/query-state";
import type { GoogleCalendarConnection } from "@/types/database.types";

type ConnectionData = { connection: GoogleCalendarConnection | null };
type CalendarConnectionStore = {
  byEmployeeId: Record<string, QueryEntry<ConnectionData>>;
  fetchConnection: (employeeId: string) => Promise<void>;
  clearConnection: (employeeId: string) => void;
};

export const useCalendarConnectionStore = create<CalendarConnectionStore>()(persist((set, get) => ({
  byEmployeeId: {},
  fetchConnection: async (employeeId) => {
    const epoch = getQueryEpoch();
    const previous = get().byEmployeeId[employeeId];
    set({ byEmployeeId: { ...get().byEmployeeId, [employeeId]: loadingQueryEntry(previous) } });
    try {
      const connection = await getGoogleCalendarConnection(employeeId);
      if (!isCurrentQueryEpoch(epoch)) return;
      set({ byEmployeeId: { ...get().byEmployeeId, [employeeId]: successQueryEntry({ connection }, get().byEmployeeId[employeeId]) } });
    } catch (cause) {
      if (!isCurrentQueryEpoch(epoch)) return;
      logger.captureException(cause, { store: "calendar-connection-store", employeeId });
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ byEmployeeId: { ...get().byEmployeeId, [employeeId]: errorQueryEntry(error, previous) } });
    }
  },
  clearConnection: (employeeId) => {
    set({ byEmployeeId: { ...get().byEmployeeId, [employeeId]: successQueryEntry({ connection: null }) } });
  },
}), clinicPersistOptions<CalendarConnectionStore>("calendar-connection", ["byEmployeeId"])));
