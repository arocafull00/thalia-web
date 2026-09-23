import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getClinicById } from "@/dal/clinics.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import { clinicPersistOptions } from "@/stores/clinic-query-persist";
import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
import { errorQueryEntry, loadingQueryEntry, successQueryEntry, type QueryEntry } from "@/stores/query-state";
import type { Clinic } from "@/types/database.types";

export type ClinicInfo = Pick<Clinic, "id" | "name" | "address" | "phone" | "specialty" | "logo_url" | "opening_time" | "closing_time" | "open_days" | "timezone">;

type ClinicInfoStore = {
  byId: Record<string, QueryEntry<ClinicInfo>>;
  fetchClinic: (clinicId: string) => Promise<void>;
};

export const useClinicInfoStore = create<ClinicInfoStore>()(persist((set, get) => ({
  byId: {},
  fetchClinic: async (clinicId) => {
    if (getActiveClinicId() !== clinicId) return;
    const epoch = getQueryEpoch();
    set({ byId: { ...get().byId, [clinicId]: loadingQueryEntry(get().byId[clinicId]) } });
    try {
      const clinic = await getClinicById(clinicId);
      if (!isCurrentQueryEpoch(epoch) || getActiveClinicId() !== clinicId) return;
      set({ byId: { ...get().byId, [clinicId]: successQueryEntry(clinic, get().byId[clinicId]) } });
    } catch (cause) {
      if (!isCurrentQueryEpoch(epoch)) return;
      logger.captureException(cause, { store: "clinic-info-store", clinicId });
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ byId: { ...get().byId, [clinicId]: errorQueryEntry(error, get().byId[clinicId]) } });
    }
  },
}), clinicPersistOptions<ClinicInfoStore>("clinic-info", ["byId"])));
