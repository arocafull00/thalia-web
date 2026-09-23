import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getClinicReminderSettings, updateClinicReminderSettings } from "@/dal/appointment-reminders.dal";
import { logger } from "@/lib/logger";
import { clinicPersistOptions } from "@/stores/clinic-query-persist";
import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
import { errorQueryEntry, loadingQueryEntry, successQueryEntry, type QueryEntry } from "@/stores/query-state";

type SettingsData = Awaited<ReturnType<typeof getClinicReminderSettings>>;
type SettingsValues = Parameters<typeof updateClinicReminderSettings>[1];
type WhatsAppSettingsStore = {
  byClinicId: Record<string, QueryEntry<SettingsData>>;
  saving: boolean;
  fetchSettings: (clinicId: string) => Promise<void>;
  saveSettings: (clinicId: string, values: SettingsValues) => Promise<void>;
};

export const useWhatsAppSettingsStore = create<WhatsAppSettingsStore>()(persist((set, get) => ({
  byClinicId: {},
  saving: false,
  fetchSettings: async (clinicId) => {
    const epoch = getQueryEpoch();
    const previous = get().byClinicId[clinicId];
    set({ byClinicId: { ...get().byClinicId, [clinicId]: loadingQueryEntry(previous) } });
    try {
      const settings = await getClinicReminderSettings(clinicId);
      if (!isCurrentQueryEpoch(epoch)) return;
      set({ byClinicId: { ...get().byClinicId, [clinicId]: successQueryEntry(settings, get().byClinicId[clinicId]) } });
    } catch (cause) {
      if (!isCurrentQueryEpoch(epoch)) return;
      logger.captureException(cause, { store: "whatsapp-settings-store", clinicId });
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ byClinicId: { ...get().byClinicId, [clinicId]: errorQueryEntry(error, previous) } });
    }
  },
  saveSettings: async (clinicId, values) => {
    const epoch = getQueryEpoch();
    set({ saving: true });
    try {
      await updateClinicReminderSettings(clinicId, values);
      if (!isCurrentQueryEpoch(epoch)) return;
      const previous = get().byClinicId[clinicId];
      set({ byClinicId: { ...get().byClinicId, [clinicId]: successQueryEntry({ ...previous?.data, ...values } as SettingsData) } });
    } finally {
      if (isCurrentQueryEpoch(epoch)) set({ saving: false });
    }
  },
}), clinicPersistOptions<WhatsAppSettingsStore>("whatsapp-settings", ["byClinicId"])));
