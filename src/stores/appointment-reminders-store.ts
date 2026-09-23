import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getRemindersForAppointment, sendManualReminder } from "@/dal/appointment-reminders.dal";
import { logger } from "@/lib/logger";
import { clinicPersistOptions } from "@/stores/clinic-query-persist";
import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
import { errorQueryEntry, loadingQueryEntry, successQueryEntry, type QueryEntry } from "@/stores/query-state";
import type { AppointmentReminder } from "@/types/database.types";

type AppointmentRemindersStore = {
  byAppointmentId: Record<string, QueryEntry<AppointmentReminder[]>>;
  sending: boolean;
  fetchReminders: (appointmentId: string) => Promise<void>;
  sendManual: (appointmentId: string, clinicId: string) => ReturnType<typeof sendManualReminder>;
};

export const useAppointmentRemindersStore = create<AppointmentRemindersStore>()(persist((set, get) => ({
  byAppointmentId: {},
  sending: false,
  fetchReminders: async (appointmentId) => {
    const epoch = getQueryEpoch();
    const previous = get().byAppointmentId[appointmentId];
    set({ byAppointmentId: { ...get().byAppointmentId, [appointmentId]: loadingQueryEntry(previous) } });
    try {
      const reminders = await getRemindersForAppointment(appointmentId);
      if (!isCurrentQueryEpoch(epoch)) return;
      set({ byAppointmentId: { ...get().byAppointmentId, [appointmentId]: successQueryEntry(reminders, get().byAppointmentId[appointmentId]) } });
    } catch (cause) {
      if (!isCurrentQueryEpoch(epoch)) return;
      logger.captureException(cause, { store: "appointment-reminders-store", appointmentId });
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ byAppointmentId: { ...get().byAppointmentId, [appointmentId]: errorQueryEntry(error, previous) } });
    }
  },
  sendManual: async (appointmentId, clinicId) => {
    set({ sending: true });
    try {
      const summary = await sendManualReminder(appointmentId, clinicId);
      await get().fetchReminders(appointmentId);
      return summary;
    } finally {
      set({ sending: false });
    }
  },
}), clinicPersistOptions<AppointmentRemindersStore>("appointment-reminders", ["byAppointmentId"])));
