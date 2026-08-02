import type { RealtimeChannel } from "@supabase/supabase-js";
import { addMinutes } from "date-fns";
import { create } from "zustand";

import {
  deleteAppointment as deleteAppointmentDal,
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
  isControlledAppointmentError,
  toAppointmentError,
} from "@/lib/appointment-errors";
import { logger } from "@/lib/logger";
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
  startsAtIso: string;
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
  return JSON.stringify({
    start: new Date(start).toISOString(),
    end: new Date(end).toISOString(),
    employeeId,
  });
}

let appointmentsRealtimeChannel: RealtimeChannel | null = null;
let appointmentsRealtimeSubscribers = 0;

function calculateEndDate(startsAtIso: string, treatments: Treatment[]) {
  const duration = treatments.reduce(
    (total, treatment) => total + (treatment.duration_minutes ?? 30),
    0,
  );
  return addMinutes(new Date(startsAtIso), duration || 30);
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

function updateAppointmentInRangeEntries(
  byRange: Record<string, QueryEntry<AppointmentWithRelations[]>>,
  appointment: Appointment,
) {
  return Object.fromEntries(
    Object.entries(byRange).map(([key, entry]) => [
      key,
      entry.data
        ? {
            ...entry,
            data: entry.data.map((item) =>
              item.id === appointment.id ? { ...item, ...appointment } : item,
            ),
          }
        : entry,
    ]),
  );
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
  deleting: boolean;
  deleteError: Error | null;
  subscribeRealtime: () => void;
  unsubscribeRealtime: () => void;
  fetchAppointments: (params: {
    start: Date;
    end: Date;
    employeeId: string | null;
  }) => Promise<void>;
  seedAppointments: (params: {
    start: string;
    end: string;
    employeeId: string | null;
    appointments: AppointmentWithRelations[];
  }) => void;
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
    startsAtIso: string,
    endsAtIso: string,
  ) => Promise<Appointment>;
  deleteAppointment: (id: string, restoreStock: boolean) => Promise<void>;
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
  deleting: false,
  deleteError: null,

  subscribeRealtime: subscribeAppointmentsRealtime,
  unsubscribeRealtime: unsubscribeAppointmentsRealtime,

  seedAppointments: ({ start, end, employeeId, appointments }) => {
    const key = appointmentsKey(start, end, employeeId);

    set((state) => {
      if (state.byRange[key]?.data != null) {
        return state;
      }

      return {
        byRange: {
          ...state.byRange,
          [key]: successQueryEntry(appointments),
        },
      };
    });
  },

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
      logger.captureException(cause, {
        store: "appointments-store",
        action: "fetchAppointments",
        clinicId: getActiveClinicId(),
        employeeId,
      });
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
      logger.captureException(cause, {
        store: "appointments-store",
        action: "fetchAppointment",
        appointmentId,
      });
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
      logger.captureException(cause, {
        store: "appointments-store",
        action: "fetchAppointmentInventoryItems",
        appointmentId,
      });
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
      logger.captureException(cause, {
        store: "appointments-store",
        action: "fetchDefaultMaterials",
        treatmentIds,
      });
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
      const error = toAppointmentError(cause);
      if (!isControlledAppointmentError(error)) {
        logger.captureException(error, {
          store: "appointments-store",
          action: "replaceAppointmentInventoryItems",
          appointmentId,
        });
      }
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
      const endsAt = calculateEndDate(validated.startsAtIso, treatments);

      const createdAppointment = await insertAppointment({
        clinic_id: validated.clinicId,
        patient_id: validated.patientId,
        employee_id: validated.employeeId,
        starts_at: validated.startsAtIso,
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
      const error = toAppointmentError(cause);
      if (!isControlledAppointmentError(error)) {
        logger.captureException(error, {
          store: "appointments-store",
          action: "createAppointment",
          clinicId: input.clinicId,
          patientId: input.patientId,
        });
      }
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
      const endsAt = calculateEndDate(validated.startsAtIso, treatments);

      const appointment = await updateAppointment(validated.id, {
        patient_id: validated.patientId,
        employee_id: validated.employeeId,
        starts_at: validated.startsAtIso,
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
      const error = toAppointmentError(cause);
      if (!isControlledAppointmentError(error)) {
        logger.captureException(error, {
          store: "appointments-store",
          action: "updateAppointment",
          appointmentId: input.id,
        });
      }
      set({ updating: false, updateError: error });
      throw error;
    }
  },

  updateAppointmentStatus: async (id, status) => {
    set({ updatingStatus: true, updateStatusError: null });

    try {
      const appointment = await updateAppointmentStatus(id, status);
      set((state) => {
        const detailEntry = state.byId[id];

        return {
          byRange: updateAppointmentInRangeEntries(state.byRange, appointment),
          byId: detailEntry?.data
            ? {
                ...state.byId,
                [id]: successQueryEntry({
                  ...detailEntry.data,
                  ...appointment,
                }),
              }
            : state.byId,
        };
      });

      await Promise.all([
        refreshAllAppointmentEntries(),
        get().fetchAppointment(id),
        useDashboardStore.getState().fetchDashboard(),
      ]);

      if (status === "completed") {
        void useInventoryStore.getState().fetchInventoryItems();
      }

      set({ updatingStatus: false });
      return appointment;
    } catch (cause) {
      const error = toAppointmentError(cause);
      if (!isControlledAppointmentError(error)) {
        logger.captureException(error, {
          store: "appointments-store",
          action: "updateAppointmentStatus",
          appointmentId: id,
          status,
        });
      }
      set({ updatingStatus: false, updateStatusError: error });
      throw error;
    }
  },

  rescheduleAppointment: async (id, startsAtIso, endsAtIso) => {
    set({ rescheduling: true, rescheduleError: null });

    try {
      const appointment = await dalRescheduleAppointment(
        id,
        startsAtIso,
        endsAtIso,
      );

      await refreshAllAppointmentEntries();
      await get().fetchAppointment(id);
      await useDashboardStore.getState().fetchDashboard();
      set({ rescheduling: false });
      return appointment;
    } catch (cause) {
      const error = toAppointmentError(cause);
      if (!isControlledAppointmentError(error)) {
        logger.captureException(error, {
          store: "appointments-store",
          action: "rescheduleAppointment",
          appointmentId: id,
        });
      }
      set({ rescheduling: false, rescheduleError: error });
      throw error;
    }
  },

  deleteAppointment: async (id, restoreStock) => {
    set({ deleting: true, deleteError: null });

    try {
      await deleteAppointmentDal(id, restoreStock);

      const nextById = { ...get().byId };
      delete nextById[id];

      await Promise.all([
        refreshAllAppointmentEntries(),
        useDashboardStore.getState().fetchDashboard(),
      ]);

      if (restoreStock) {
        void useInventoryStore.getState().fetchInventoryItems();
      }

      set({ byId: nextById, deleting: false });
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "appointments-store",
        action: "deleteAppointment",
        appointmentId: id,
        restoreStock,
      });
      set({ deleting: false, deleteError: error });
      throw error;
    }
  },
}));

export { appointmentsKey };
