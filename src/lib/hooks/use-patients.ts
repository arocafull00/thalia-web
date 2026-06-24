import { useCallback, useEffect } from "react";

import {
  patientsListKey,
  usePatientsStore,
  type PatientFormInput,
} from "@/stores/patients-store";

export type { PatientFormInput };

export function usePatients(search: string) {
  const key = patientsListKey(search);
  const entry = usePatientsStore((state) => state.listBySearch[key]);
  const fetchPatients = usePatientsStore((state) => state.fetchPatients);

  useEffect(() => {
    void fetchPatients(search);
  }, [fetchPatients, search]);

  return {
    data: entry?.data ?? undefined,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function usePatient(patientId: string) {
  const entry = usePatientsStore((state) => state.byId[patientId]);
  const fetchPatient = usePatientsStore((state) => state.fetchPatient);

  useEffect(() => {
    void fetchPatient(patientId);
  }, [fetchPatient, patientId]);

  return {
    data: entry?.data,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function usePatientAppointments(patientId: string) {
  const entry = usePatientsStore((state) => state.appointmentsByPatientId[patientId]);
  const fetchPatientAppointments = usePatientsStore((state) => state.fetchPatientAppointments);

  useEffect(() => {
    void fetchPatientAppointments(patientId);
  }, [fetchPatientAppointments, patientId]);

  return {
    data: entry?.data ?? undefined,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function useUpcomingPatientAppointments(patientId: string) {
  const entry = usePatientsStore((state) => state.upcomingByPatientId[patientId]);
  const fetchUpcomingPatientAppointments = usePatientsStore(
    (state) => state.fetchUpcomingPatientAppointments,
  );

  useEffect(() => {
    void fetchUpcomingPatientAppointments(patientId);
  }, [fetchUpcomingPatientAppointments, patientId]);

  return {
    data: entry?.data ?? undefined,
    isLoading: entry?.loading ?? true,
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
  const uploadPatientAvatar = usePatientsStore((state) => state.uploadPatientAvatar);
  const isPending = usePatientsStore((state) => state.uploadingAvatar);
  const error = usePatientsStore((state) => state.uploadAvatarError);

  const mutate = useCallback(
    (
      { patientId, imageUri }: { patientId: string; imageUri: string },
      options?: { onSuccess?: () => void },
    ) => {
      uploadPatientAvatar(patientId, imageUri).then(() => options?.onSuccess?.());
    },
    [uploadPatientAvatar],
  );

  const mutateAsync = useCallback(
    ({ patientId, imageUri }: { patientId: string; imageUri: string }) =>
      uploadPatientAvatar(patientId, imageUri),
    [uploadPatientAvatar],
  );

  return { mutate, mutateAsync, isPending, error };
}
