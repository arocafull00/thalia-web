import { useCallback, useEffect } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useClinicServerSeed,
  useServerSeed,
} from "@/lib/hooks/use-server-seed";
import {
  patientsListKey,
  usePatientsStore,
  type PatientFormInput,
} from "@/stores/patients-store";
import { isInitialLoading } from "@/stores/query-state";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

export type { PatientFormInput };

export function usePatients(search: string, initialData?: Patient[]) {
  const key = patientsListKey(search);
  const entry = usePatientsStore((state) => state.listBySearch[key]);
  const fetchPatients = usePatientsStore((state) => state.fetchPatients);
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchPatients(search);
  }, [clinicId, fetchPatients, hasClientData, search, seededData]);

  const data = entry?.data ?? seededData;
  const refresh = useCallback(() => {
    if (usePatientsStore.getState().listBySearch[key]?.loading) {
      return Promise.resolve();
    }

    return fetchPatients(search);
  }, [fetchPatients, key, search]);

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    isRefreshing: entry?.loading ?? false,
    error: entry?.error,
    refresh,
  };
}

export function usePatient(patientOrId: Patient | string) {
  const patientId =
    typeof patientOrId === "string" ? patientOrId : patientOrId.id;
  const initialData = typeof patientOrId === "string" ? undefined : patientOrId;
  const entry = usePatientsStore((state) => state.byId[patientId]);
  const fetchPatient = usePatientsStore((state) => state.fetchPatient);
  const seededData = useServerSeed(
    patientId,
    initialData?.id ?? "",
    initialData,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (!patientId.trim() || (seededData !== undefined && !hasClientData)) {
      return;
    }

    void fetchPatient(patientId);
  }, [fetchPatient, hasClientData, patientId, seededData]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function usePatientAppointments(
  patientId: string,
  initialData?: AppointmentWithRelations[],
) {
  const entry = usePatientsStore(
    (state) => state.appointmentsByPatientId[patientId],
  );
  const fetchPatientAppointments = usePatientsStore(
    (state) => state.fetchPatientAppointments,
  );
  const seededData = useServerSeed(
    patientId,
    initialData === undefined ? "" : patientId,
    initialData,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchPatientAppointments(patientId);
  }, [fetchPatientAppointments, hasClientData, patientId, seededData]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useUpcomingPatientAppointments(patientId: string) {
  const entry = usePatientsStore(
    (state) => state.upcomingByPatientId[patientId],
  );
  const fetchUpcomingPatientAppointments = usePatientsStore(
    (state) => state.fetchUpcomingPatientAppointments,
  );

  useEffect(() => {
    void fetchUpcomingPatientAppointments(patientId);
  }, [fetchUpcomingPatientAppointments, patientId]);

  return {
    data: entry?.data ?? undefined,
    isLoading: isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useCreatePatient() {
  const createPatient = usePatientsStore((state) => state.createPatient);
  const isPending = usePatientsStore((state) => state.creating);
  const error = usePatientsStore((state) => state.createError);

  const mutateAsync = useCallback(
    (input: PatientFormInput) => createPatient(input),
    [createPatient],
  );

  return { mutateAsync, isPending, error };
}

export function useUpdatePatient() {
  const updatePatient = usePatientsStore((state) => state.updatePatient);
  const isPending = usePatientsStore((state) => state.updating);
  const error = usePatientsStore((state) => state.updateError);

  const mutate = useCallback(
    (
      { id, values }: { id: string; values: Partial<PatientFormInput> },
      options?: { onSuccess?: () => void },
    ) => {
      updatePatient(id, values).then(() => options?.onSuccess?.());
    },
    [updatePatient],
  );

  return { mutate, isPending, error };
}

export function useUploadPatientAvatar() {
  const uploadPatientAvatar = usePatientsStore(
    (state) => state.uploadPatientAvatar,
  );
  const isPending = usePatientsStore((state) => state.uploadingAvatar);
  const error = usePatientsStore((state) => state.uploadAvatarError);

  const mutate = useCallback(
    (
      { patientId, file }: { patientId: string; file: File },
      options?: { onSuccess?: () => void },
    ) => {
      uploadPatientAvatar(patientId, file).then(() => options?.onSuccess?.());
    },
    [uploadPatientAvatar],
  );

  const mutateAsync = useCallback(
    ({ patientId, file }: { patientId: string; file: File }) =>
      uploadPatientAvatar(patientId, file),
    [uploadPatientAvatar],
  );

  return { mutate, mutateAsync, isPending, error };
}
