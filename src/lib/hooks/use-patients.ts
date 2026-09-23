import { useCallback, useEffect, useMemo } from "react";

import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useClinicServerSeed,
  useServerSeed,
} from "@/lib/hooks/use-server-seed";
import { PATIENTS_PAGE_SIZE } from "@/lib/patient-pagination";
import {
  patientsListKey,
  patientsPageKey,
  usePatientsStore,
  type PatientFormInput,
  type PatientsPageQuery,
} from "@/stores/patients-store";
import {
  isInitialLoading,
  isQueryFresh,
} from "@/stores/query-state";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

export type { PatientFormInput };

type PatientsPageFilters = {
  marketingOptIn: boolean | null;
  page: number;
  search: string;
};

type PatientsPageSeed = {
  initialPatients?: Patient[];
  initialTotal?: number;
  initialQuery?: PatientsPageQuery;
};

/**
 * Listado de pacientes paginado en servidor.
 *
 * Filtros, búsqueda y orden viajan al servidor: filtrar en cliente sobre una
 * página ya recortada daría recuentos falsos y rompería la paginación.
 */
export function usePatientsPage(
  filters: PatientsPageFilters,
  seed?: PatientsPageSeed,
) {
  const query = useMemo<PatientsPageQuery>(
    () => ({
      search: filters.search,
      marketingOptIn: filters.marketingOptIn,
      page: filters.page,
      pageSize: PATIENTS_PAGE_SIZE,
    }),
    [filters.marketingOptIn, filters.page, filters.search],
  );

  const key = patientsPageKey(query);
  const entry = usePatientsStore((state) => state.byPage[key]);
  const fetchPatientsPage = usePatientsStore(
    (state) => state.fetchPatientsPage,
  );
  const seedPatientsPage = usePatientsStore((state) => state.seedPatientsPage);

  // La siembra sólo vale para la consulta exacta que resolvió el servidor: si
  // los filtros de la URL no coinciden, se descarta y el cliente vuelve a pedir.
  const seededResult = useServerSeed(
    key,
    seed?.initialQuery ? patientsPageKey(seed.initialQuery) : "",
    seed?.initialPatients
      ? {
          patients: seed.initialPatients,
          total: seed.initialTotal ?? seed.initialPatients.length,
        }
      : undefined,
  );
  const hasClientData = entry?.data != null;
  useEffect(() => {
    if (seededResult === undefined || hasClientData) {
      return;
    }

    seedPatientsPage(query, seededResult);
  }, [hasClientData, query, seedPatientsPage, seededResult]);

  useRevalidateOnEntry(`patients-page:${key}`, () => fetchPatientsPage(query));

  const refresh = useCallback(() => {
    if (usePatientsStore.getState().byPage[key]?.loading) {
      return Promise.resolve();
    }

    return fetchPatientsPage(query);
  }, [fetchPatientsPage, key, query]);

  const resolved = isQueryFresh(entry)
    ? entry!.data
    : (seededResult ?? entry?.data ?? null);
  const patients = useMemo(() => resolved?.patients ?? [], [resolved]);

  return {
    patients,
    total: resolved?.total ?? 0,
    error: entry?.error ?? null,
    isLoading: resolved == null && isInitialLoading(entry),
    // `loading` con datos ya en pantalla es un refresco, no una carga inicial.
    isRefreshing: entry?.loading ?? false,
    refresh,
  };
}

export function usePatients(search: string, initialData?: Patient[]) {
  const key = patientsListKey(search);
  const entry = usePatientsStore((state) => state.listBySearch[key]);
  const fetchPatients = usePatientsStore((state) => state.fetchPatients);
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  useRevalidateOnEntry(clinicId ? `patients-list:${key}` : null, () => fetchPatients(search));

  const data = isQueryFresh(entry)
    ? entry!.data
    : (seededData ?? entry?.data);
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
  const clinicId = useClinicId();
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
  useRevalidateOnEntry(
    patientId.trim() && clinicId ? `patient:${clinicId}:${patientId}` : null,
    () => fetchPatient(patientId, clinicId),
  );

  const stored = isQueryFresh(entry)
    ? entry!.data
    : (seededData ?? entry?.data);
  const data = stored?.clinic_id === clinicId ? stored : null;

  return {
    data,
    isLoading: !clinicId || (data == null && isInitialLoading(entry)),
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

  useRevalidateOnEntry(patientId ? `patient-appointments:${patientId}` : null, () => fetchPatientAppointments(patientId));

  const data = isQueryFresh(entry)
    ? entry!.data
    : (seededData ?? entry?.data);

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

  useRevalidateOnEntry(patientId ? `patient-upcoming:${patientId}` : null, () => fetchUpcomingPatientAppointments(patientId));

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
