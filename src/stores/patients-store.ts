import { create } from "zustand";

import {
  getPatient,
  getPatientAppointments,
  getPatients,
  getUpcomingPatientAppointments,
  insertPatient,
  updatePatient,
} from "@/dal/patients.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import {
  patientSchema,
  patientUpdateSchema,
} from "@/lib/schemas/patient-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { uploadFile } from "@/lib/storage";
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
  marketing_opt_in: boolean;
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
  uploadPatientAvatar: (patientId: string, file: File) => Promise<Patient>;
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
      const clinicId = getActiveClinicId();
      const patients = await getPatients(clinicId, search);
      set({
        listBySearch: {
          ...get().listBySearch,
          [key]: successQueryEntry(patients),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "patients-store",
        action: "fetchPatients",
        clinicId: getActiveClinicId(),
        search: key,
      });
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
      const patient = await getPatient(patientId);
      set({ byId: { ...get().byId, [patientId]: successQueryEntry(patient) } });
    } catch (cause) {
      logger.captureException(cause, {
        store: "patients-store",
        action: "fetchPatient",
        patientId,
      });
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
      const appointments = await getPatientAppointments(patientId);
      set({
        appointmentsByPatientId: {
          ...get().appointmentsByPatientId,
          [patientId]: successQueryEntry(appointments),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "patients-store",
        action: "fetchPatientAppointments",
        patientId,
      });
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
      const appointments = await getUpcomingPatientAppointments(patientId);
      set({
        upcomingByPatientId: {
          ...get().upcomingByPatientId,
          [patientId]: successQueryEntry(appointments),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "patients-store",
        action: "fetchUpcomingPatientAppointments",
        patientId,
      });
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
      const parsed = patientSchema.safeParse(input);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      const patient = await insertPatient(parsed.data);

      const keys = Object.keys(get().listBySearch);
      await Promise.all(
        keys.map((key) => get().fetchPatients(key === "__all__" ? "" : key)),
      );
      set({ creating: false });
      return patient;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patients-store",
        action: "createPatient",
        clinicId: input.clinic_id,
      });
      set({ creating: false, createError: error });
      throw error;
    }
  },

  updatePatient: async (id, values) => {
    set({ updating: true, updateError: null });

    try {
      const parsed = patientUpdateSchema.safeParse(values);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      const patient = await updatePatient(id, parsed.data);

      const keys = Object.keys(get().listBySearch);
      await Promise.all(
        keys.map((key) => get().fetchPatients(key === "__all__" ? "" : key)),
      );
      await get().fetchPatient(id);
      set({ updating: false });
      return patient;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "patients-store",
        action: "updatePatient",
        patientId: id,
      });
      set({ updating: false, updateError: error });
      throw error;
    }
  },

  uploadPatientAvatar: async (patientId, file) => {
    set({ uploadingAvatar: true, uploadAvatarError: null });

    try {
      const key = await uploadFile(
        `patients/${patientId}/avatar.webp`,
        file,
        "image/webp",
      );
      const patient = await updatePatient(patientId, { avatar_url: key });

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
      logger.captureException(error, {
        store: "patients-store",
        action: "uploadPatientAvatar",
        patientId,
      });
      set({ uploadingAvatar: false, uploadAvatarError: error });
      throw error;
    }
  },
}));

export { patientsListKey };
