import { create } from "zustand";

import { getActiveClinicId } from "@/lib/active-clinic-id";
import { uploadFile } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import {
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

export type PatientFormInput = {
  clinic_id: string;
  full_name: string;
  dni: string | null;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
};

function patientsListKey(search: string) {
  return search.trim() || "__all__";
}

type PatientsStore = {
  listBySearch: Record<string, QueryEntry<Patient[]>>;
  byId: Record<string, QueryEntry<Patient>>;
  appointmentsByPatientId: Record<
    string,
    QueryEntry<AppointmentWithRelations[]>
  >;
  upcomingByPatientId: Record<string, QueryEntry<AppointmentWithRelations[]>>;
  creating: boolean;
  createError: Error | null;
  updating: boolean;
  updateError: Error | null;
  uploadingAvatar: boolean;
  uploadAvatarError: Error | null;
  fetchPatients: (search: string) => Promise<void>;
  fetchPatient: (patientId: string) => Promise<void>;
  fetchPatientAppointments: (patientId: string) => Promise<void>;
  fetchUpcomingPatientAppointments: (patientId: string) => Promise<void>;
  createPatient: (input: PatientFormInput) => Promise<Patient>;
  updatePatient: (
    id: string,
    values: Partial<PatientFormInput>,
  ) => Promise<Patient>;
  uploadPatientAvatar: (
    patientId: string,
    imageUri: string,
  ) => Promise<Patient>;
};

export const usePatientsStore = create<PatientsStore>((set, get) => ({
  listBySearch: {},
  byId: {},
  appointmentsByPatientId: {},
  upcomingByPatientId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,
  uploadingAvatar: false,
  uploadAvatarError: null,

  fetchPatients: async (search) => {
    const key = patientsListKey(search);
    const previous = get().listBySearch[key];
    set({
      listBySearch: {
        ...get().listBySearch,
        [key]: loadingQueryEntry(previous),
      },
    });

    try {
      let query = supabase.from("patients").select("*").order("full_name");
      const clinicId = getActiveClinicId();

      if (clinicId) {
        query = query.eq("clinic_id", clinicId);
      }

      if (search.trim()) {
        query = query.or(
          `full_name.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%`,
        );
      }

      const { data, error } = await query;
      const patients = unwrapSupabaseList(data, error) as Patient[];
      set({
        listBySearch: {
          ...get().listBySearch,
          [key]: successQueryEntry(patients),
        },
      });
    } catch (cause) {
      set({
        listBySearch: {
          ...get().listBySearch,
          [key]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchPatient: async (patientId) => {
    const previous = get().byId[patientId];
    set({ byId: { ...get().byId, [patientId]: loadingQueryEntry(previous) } });

    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq("id", patientId)
        .single();
      const patient = unwrapSupabase(data, error) as Patient;
      set({ byId: { ...get().byId, [patientId]: successQueryEntry(patient) } });
    } catch (cause) {
      set({
        byId: {
          ...get().byId,
          [patientId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchPatientAppointments: async (patientId) => {
    const previous = get().appointmentsByPatientId[patientId];
    set({
      appointmentsByPatientId: {
        ...get().appointmentsByPatientId,
        [patientId]: loadingQueryEntry(previous),
      },
    });

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_treatments(*, treatment_types(id, name, color, price))",
        )
        .eq("patient_id", patientId)
        .order("starts_at", { ascending: false });

      const appointments = unwrapSupabaseList(
        data,
        error,
      ) as AppointmentWithRelations[];
      set({
        appointmentsByPatientId: {
          ...get().appointmentsByPatientId,
          [patientId]: successQueryEntry(appointments),
        },
      });
    } catch (cause) {
      set({
        appointmentsByPatientId: {
          ...get().appointmentsByPatientId,
          [patientId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchUpcomingPatientAppointments: async (patientId) => {
    const previous = get().upcomingByPatientId[patientId];
    set({
      upcomingByPatientId: {
        ...get().upcomingByPatientId,
        [patientId]: loadingQueryEntry(previous),
      },
    });

    try {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_treatments(*, treatment_types(id, name, color, price))",
        )
        .eq("patient_id", patientId)
        .gt("starts_at", new Date().toISOString())
        .order("starts_at");

      const appointments = unwrapSupabaseList(
        data,
        error,
      ) as AppointmentWithRelations[];
      set({
        upcomingByPatientId: {
          ...get().upcomingByPatientId,
          [patientId]: successQueryEntry(appointments),
        },
      });
    } catch (cause) {
      set({
        upcomingByPatientId: {
          ...get().upcomingByPatientId,
          [patientId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  createPatient: async (input) => {
    set({ creating: true, createError: null });

    try {
      const { data, error } = await supabase
        .from("patients")
        .insert(input)
        .select("*")
        .single();
      const patient = unwrapSupabase(data, error) as Patient;

      const keys = Object.keys(get().listBySearch);
      await Promise.all(
        keys.map((key) => get().fetchPatients(key === "__all__" ? "" : key)),
      );
      set({ creating: false });
      return patient;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ creating: false, createError: error });
      throw error;
    }
  },

  updatePatient: async (id, values) => {
    set({ updating: true, updateError: null });

    try {
      const { data, error } = await supabase
        .from("patients")
        .update(values)
        .eq("id", id)
        .select("*")
        .single();
      const patient = unwrapSupabase(data, error) as Patient;

      const keys = Object.keys(get().listBySearch);
      await Promise.all(
        keys.map((key) => get().fetchPatients(key === "__all__" ? "" : key)),
      );
      await get().fetchPatient(id);
      set({ updating: false });
      return patient;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ updating: false, updateError: error });
      throw error;
    }
  },

  uploadPatientAvatar: async (patientId, imageUri) => {
    set({ uploadingAvatar: true, uploadAvatarError: null });

    try {
      const key = await uploadFile(
        `patients/${patientId}/avatar.jpg`,
        imageUri,
        "image/jpeg",
      );
      const { data, error } = await supabase
        .from("patients")
        .update({ avatar_url: key })
        .eq("id", patientId)
        .select("*")
        .single();
      const patient = unwrapSupabase(data, error) as Patient;

      const keys = Object.keys(get().listBySearch);
      await Promise.all(
        keys.map((searchKey) =>
          get().fetchPatients(searchKey === "__all__" ? "" : searchKey),
        ),
      );
      await get().fetchPatient(patientId);
      set({ uploadingAvatar: false });
      return patient;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ uploadingAvatar: false, uploadAvatarError: error });
      throw error;
    }
  },
}));

export { patientsListKey };
