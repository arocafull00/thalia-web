import type { RealtimeChannel } from "@supabase/supabase-js";
import { addMinutes } from "date-fns";
import { create } from "zustand";

import {
  deleteAppointmentTreatments,
  getAppointment,
  getAppointmentInventoryItems,
  getAppointments,
  getDefaultMaterials,
  insertAppointment,
  insertAppointmentTreatments,
  replaceAppointmentInventoryItems,
  rescheduleAppointment as dalRescheduleAppointment,
  updateAppointment,
  updateAppointmentStatus,
  type AppointmentInventoryLinkInput,
  type EffectiveAppointmentMaterial,
} from "@/dal/appointments.dal";
import { getTreatmentsByIds } from "@/dal/treatments.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import {
  appointmentSchema,
  appointmentUpdateSchema,
} from "@/lib/schemas/appointment-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { supabase } from "@/lib/supabase";
import { useDashboardStore } from "@/stores/dashboard-store";
import { useInventoryStore } from "@/stores/inventory-store";
import {
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type {
  Appointment,
  AppointmentInventoryItemWithInventory,
  AppointmentStatus,
  AppointmentWithRelations,
  Treatment,
} from "@/types/database.types";

export type { AppointmentInventoryLinkInput };

export type AppointmentFormInput = {
  clinicId: string;
  patientId: string;
  employeeId: string;
  startsAt: Date;
  treatmentIds: string[];
  notes: string | null;
};

export type AppointmentUpdateInput = AppointmentFormInput & {
  id: string;
};

function appointmentsKey(
  start: string,
  end: string,
  employeeId: string | null,
) {
  return JSON.stringify({ start, end, employeeId });
}

let appointmentsRealtimeChannel: RealtimeChannel | null = null;
let appointmentsRealtimeSubscribers = 0;

function calculateEndDate(startsAt: Date, treatments: Treatment[]) {
  const duration = treatments.reduce(
    (total, treatment) => total + (treatment.duration_minutes ?? 30),
    0,
  );
  return addMinutes(startsAt, duration || 30);
}

async function refreshAllAppointmentEntries() {
  const { byRange, fetchAppointments } = useAppointmentsStore.getState();
  await Promise.all(
    Object.keys(byRange).map((key) => {
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
  );
}

function subscribeAppointmentsRealtime() {
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

function unsubscribeAppointmentsRealtime() {
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

function defaultMaterialsKey(treatmentIds: string[]) {
  return [...treatmentIds].sort().join(",");
}

type AppointmentsStore = {
  byRange: Record<string, QueryEntry<AppointmentWithRelations[]>>;
  byId: Record<string, QueryEntry<AppointmentWithRelations>>;
  appointmentInventoryById: Record<
    string,
    QueryEntry<AppointmentInventoryItemWithInventory[]>
  >;
  defaultMaterialsByKey: Record<
    string,
    QueryEntry<EffectiveAppointmentMaterial[]>
  >;
  replacingInventory: boolean;
  replaceInventoryError: Error | null;
  creating: boolean;
  createError: Error | null;
  updatingStatus: boolean;
  updateStatusError: Error | null;
  rescheduling: boolean;
  rescheduleError: Error | null;
  updating: boolean;
  updateError: Error | null;
  subscribeRealtime: () => void;
  unsubscribeRealtime: () => void;
  fetchAppointments: (params: {
    start: Date;
    end: Date;
    employeeId: string | null;
  }) => Promise<void>;
  fetchAppointment: (appointmentId: string) => Promise<void>;
  fetchAppointmentInventoryItems: (appointmentId: string) => Promise<void>;
  fetchDefaultMaterials: (treatmentIds: string[]) => Promise<void>;
  replaceAppointmentInventoryItems: (
    appointmentId: string,
    items: AppointmentInventoryLinkInput[],
  ) => Promise<void>;
  createAppointment: (input: AppointmentFormInput) => Promise<Appointment>;
  updateAppointment: (input: AppointmentUpdateInput) => Promise<Appointment>;
  updateAppointmentStatus: (
    id: string,
    status: AppointmentStatus,
  ) => Promise<Appointment>;
  rescheduleAppointment: (
    id: string,
    startsAt: Date,
    endsAt: Date,
  ) => Promise<Appointment>;
};

export const useAppointmentsStore = create<AppointmentsStore>((set, get) => ({
  byRange: {},
  byId: {},
  appointmentInventoryById: {},
  defaultMaterialsByKey: {},
  replacingInventory: false,
  replaceInventoryError: null,
  creating: false,
  createError: null,
  updatingStatus: false,
  updateStatusError: null,
  rescheduling: false,
  rescheduleError: null,
  updating: false,
  updateError: null,

  subscribeRealtime: subscribeAppointmentsRealtime,
  unsubscribeRealtime: unsubscribeAppointmentsRealtime,

  fetchAppointments: async ({ start, end, employeeId }) => {
    const startIso = start.toISOString();
    const endIso = end.toISOString();
    const key = appointmentsKey(startIso, endIso, employeeId);
    const previous = get().byRange[key];
    set({ byRange: { ...get().byRange, [key]: loadingQueryEntry(previous) } });

    try {
      const clinicId = getActiveClinicId();
      const appointments = await getAppointments({
        startIso,
        endIso,
        clinicId,
        employeeId,
      });
      set({
        byRange: { ...get().byRange, [key]: successQueryEntry(appointments) },
      });
    } catch (cause) {
      set({
        byRange: {
          ...get().byRange,
          [key]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchAppointment: async (appointmentId) => {
    const previous = get().byId[appointmentId];
    set({
      byId: { ...get().byId, [appointmentId]: loadingQueryEntry(previous) },
    });

    try {
      const appointment = await getAppointment(appointmentId);
      set({
        byId: {
          ...get().byId,
          [appointmentId]: successQueryEntry(appointment),
        },
      });
    } catch (cause) {
      set({
        byId: {
          ...get().byId,
          [appointmentId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchAppointmentInventoryItems: async (appointmentId) => {
    const previous = get().appointmentInventoryById[appointmentId];
    set({
      appointmentInventoryById: {
        ...get().appointmentInventoryById,
        [appointmentId]: loadingQueryEntry(previous),
      },
    });

    try {
      const items = await getAppointmentInventoryItems(appointmentId);
      set({
        appointmentInventoryById: {
          ...get().appointmentInventoryById,
          [appointmentId]: successQueryEntry(items),
        },
      });
    } catch (cause) {
      set({
        appointmentInventoryById: {
          ...get().appointmentInventoryById,
          [appointmentId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchDefaultMaterials: async (treatmentIds) => {
    const key = defaultMaterialsKey(treatmentIds);
    const previous = get().defaultMaterialsByKey[key];
    set({
      defaultMaterialsByKey: {
        ...get().defaultMaterialsByKey,
        [key]: loadingQueryEntry(previous),
      },
    });

    try {
      const materials = await getDefaultMaterials(treatmentIds);
      set({
        defaultMaterialsByKey: {
          ...get().defaultMaterialsByKey,
          [key]: successQueryEntry(materials),
        },
      });
    } catch (cause) {
      set({
        defaultMaterialsByKey: {
          ...get().defaultMaterialsByKey,
          [key]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  replaceAppointmentInventoryItems: async (appointmentId, items) => {
    set({ replacingInventory: true, replaceInventoryError: null });

    try {
      await replaceAppointmentInventoryItems(appointmentId, items);
      await get().fetchAppointmentInventoryItems(appointmentId);
      set({ replacingInventory: false });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ replacingInventory: false, replaceInventoryError: error });
      throw error;
    }
  },

  createAppointment: async (input) => {
    set({ creating: true, createError: null });

    try {
      const parsed = appointmentSchema.safeParse(input);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      const validated = parsed.data;
      const treatments = await getTreatmentsByIds(validated.treatmentIds);
      const endsAt = calculateEndDate(validated.startsAt, treatments);

      const createdAppointment = await insertAppointment({
        clinic_id: validated.clinicId,
        patient_id: validated.patientId,
        employee_id: validated.employeeId,
        starts_at: validated.startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        notes: validated.notes,
        status: "scheduled",
      });

      const rows = treatments.map((treatment) => ({
        appointment_id: createdAppointment.id,
        treatment_id: treatment.id,
        price_at_booking: treatment.price ?? 0,
      }));

      await insertAppointmentTreatments(rows);

      await refreshAllAppointmentEntries();
      await useDashboardStore.getState().fetchDashboard();
      set({ creating: false });
      return createdAppointment;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ creating: false, createError: error });
      throw error;
    }
  },

  updateAppointment: async (input) => {
    set({ updating: true, updateError: null });

    try {
      const parsed = appointmentUpdateSchema.safeParse(input);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      const validated = parsed.data;
      const treatments = await getTreatmentsByIds(validated.treatmentIds);
      const endsAt = calculateEndDate(validated.startsAt, treatments);

      const appointment = await updateAppointment(validated.id, {
        patient_id: validated.patientId,
        employee_id: validated.employeeId,
        starts_at: validated.startsAt.toISOString(),
        ends_at: endsAt.toISOString(),
        notes: validated.notes,
      });

      await deleteAppointmentTreatments(validated.id);

      if (treatments.length > 0) {
        const rows = treatments.map((treatment) => ({
          appointment_id: validated.id,
          treatment_id: treatment.id,
          price_at_booking: treatment.price ?? 0,
        }));

        await insertAppointmentTreatments(rows);
      }

      await refreshAllAppointmentEntries();
      await get().fetchAppointment(validated.id);
      await useDashboardStore.getState().fetchDashboard();
      set({ updating: false });
      return appointment;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ updating: false, updateError: error });
      throw error;
    }
  },

  updateAppointmentStatus: async (id, status) => {
    set({ updatingStatus: true, updateStatusError: null });

    try {
      const appointment = await updateAppointmentStatus(id, status);
      await refreshAllAppointmentEntries();
      await get().fetchAppointment(id);
      await useDashboardStore.getState().fetchDashboard();

      if (status === "completed") {
        void useInventoryStore.getState().fetchInventoryItems();
      }

      set({ updatingStatus: false });
      return appointment;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ updatingStatus: false, updateStatusError: error });
      throw error;
    }
  },

  rescheduleAppointment: async (id, startsAt, endsAt) => {
    set({ rescheduling: true, rescheduleError: null });

    try {
      const appointment = await dalRescheduleAppointment(
        id,
        startsAt.toISOString(),
        endsAt.toISOString(),
      );

      await refreshAllAppointmentEntries();
      await get().fetchAppointment(id);
      await useDashboardStore.getState().fetchDashboard();
      set({ rescheduling: false });
      return appointment;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ rescheduling: false, rescheduleError: error });
      throw error;
    }
  },
}));

export { appointmentsKey };
