import { addMinutes, endOfDay, startOfDay } from "date-fns";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { create } from "zustand";

import { getActiveClinicId } from "@/lib/active-clinic-id";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import { useDashboardStore } from "@/stores/dashboard-store";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type {
  Appointment,
  AppointmentStatus,
  AppointmentWithRelations,
  TreatmentType,
} from "@/types/database.types";

export type AppointmentFormInput = {
  clinicId: string;
  patientId: string;
  employeeId: string;
  startsAt: Date;
  treatmentTypeIds: string[];
  notes: string | null;
};

export type AppointmentUpdateInput = AppointmentFormInput & {
  id: string;
};

function appointmentsKey(start: string, end: string, employeeId: string | null) {
  return JSON.stringify({ start, end, employeeId });
}

let appointmentsRealtimeChannel: RealtimeChannel | null = null;
let appointmentsRealtimeSubscribers = 0;

async function getTreatments(treatmentTypeIds: string[]) {
  if (treatmentTypeIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("treatment_types")
    .select("*")
    .in("id", treatmentTypeIds);
  return unwrapSupabaseList(data, error) as TreatmentType[];
}

function calculateEndDate(startsAt: Date, treatments: TreatmentType[]) {
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
      return fetchAppointments({ start: new Date(start), end: new Date(end), employeeId });
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
    .on("postgres_changes", { event: "*", schema: "public", table: "appointments" }, () => {
      void refreshAllAppointmentEntries();
      void useDashboardStore.getState().fetchDashboard();
    })
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

type AppointmentsStore = {
  byRange: Record<string, QueryEntry<AppointmentWithRelations[]>>;
  byId: Record<string, QueryEntry<AppointmentWithRelations>>;
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
  createAppointment: (input: AppointmentFormInput) => Promise<Appointment>;
  updateAppointment: (input: AppointmentUpdateInput) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<Appointment>;
  rescheduleAppointment: (id: string, startsAt: Date, endsAt: Date) => Promise<Appointment>;
};

export const useAppointmentsStore = create<AppointmentsStore>((set, get) => ({
  byRange: {},
  byId: {},
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
      let query = supabase
        .from("appointments")
        .select(
          "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_treatments(*, treatment_types(id, name, color, price))",
        )
        .gte("starts_at", startIso)
        .lte("starts_at", endIso)
        .order("starts_at");

      if (employeeId) {
        query = query.eq("employee_id", employeeId);
      }

      const clinicId = getActiveClinicId();

      if (clinicId) {
        query = query.eq("clinic_id", clinicId);
      }

      const { data, error } = await query;
      const appointments = unwrapSupabaseList(data, error) as AppointmentWithRelations[];
      set({ byRange: { ...get().byRange, [key]: successQueryEntry(appointments) } });
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
    set({ byId: { ...get().byId, [appointmentId]: loadingQueryEntry(previous) } });

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          "*, patients(id, full_name, phone, avatar_url), employees(id, full_name, color, specialty, role), appointment_treatments(*, treatment_types(id, name, color, price, duration_minutes))",
        )
        .eq("id", appointmentId)
        .single();

      const appointment = unwrapSupabase(data, error) as AppointmentWithRelations;
      set({ byId: { ...get().byId, [appointmentId]: successQueryEntry(appointment) } });
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

  createAppointment: async (input) => {
    set({ creating: true, createError: null });

    try {
      const treatments = await getTreatments(input.treatmentTypeIds);
      const endsAt = calculateEndDate(input.startsAt, treatments);
      const { data: appointment, error } = await supabase
        .from("appointments")
        .insert({
          clinic_id: input.clinicId,
          patient_id: input.patientId,
          employee_id: input.employeeId,
          starts_at: input.startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          notes: input.notes,
          status: "scheduled",
        })
        .select("*")
        .single();

      const createdAppointment = unwrapSupabase(appointment, error) as Appointment;

      const rows = treatments.map((treatment) => ({
        appointment_id: createdAppointment.id,
        treatment_type_id: treatment.id,
        price_at_booking: treatment.price ?? 0,
      }));

      const { error: treatmentsError } = await supabase.from("appointment_treatments").insert(rows);

      if (treatmentsError) {
        throw treatmentsError;
      }

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
      const treatments = await getTreatments(input.treatmentTypeIds);
      const endsAt = calculateEndDate(input.startsAt, treatments);
      const { data, error } = await supabase
        .from("appointments")
        .update({
          patient_id: input.patientId,
          employee_id: input.employeeId,
          starts_at: input.startsAt.toISOString(),
          ends_at: endsAt.toISOString(),
          notes: input.notes,
        })
        .eq("id", input.id)
        .select("*")
        .single();

      const appointment = unwrapSupabase(data, error) as Appointment;

      const { error: deleteError } = await supabase
        .from("appointment_treatments")
        .delete()
        .eq("appointment_id", input.id);

      if (deleteError) {
        throw deleteError;
      }

      if (treatments.length > 0) {
        const rows = treatments.map((treatment) => ({
          appointment_id: input.id,
          treatment_type_id: treatment.id,
          price_at_booking: treatment.price ?? 0,
        }));

        const { error: treatmentsError } = await supabase
          .from("appointment_treatments")
          .insert(rows);

        if (treatmentsError) {
          throw treatmentsError;
        }
      }

      await refreshAllAppointmentEntries();
      await get().fetchAppointment(input.id);
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
      const { data, error } = await supabase
        .from("appointments")
        .update({ status })
        .eq("id", id)
        .select("*")
        .single();
      const appointment = unwrapSupabase(data, error) as Appointment;
      await refreshAllAppointmentEntries();
      await get().fetchAppointment(id);
      await useDashboardStore.getState().fetchDashboard();
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
      const { data, error } = await supabase
        .from("appointments")
        .update({ starts_at: startsAt.toISOString(), ends_at: endsAt.toISOString() })
        .eq("id", id)
        .select("*")
        .single();

      const appointment = unwrapSupabase(data, error) as Appointment;
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
