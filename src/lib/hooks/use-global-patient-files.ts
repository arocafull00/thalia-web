import { useCallback, useEffect, useMemo } from "react";

import type { GlobalPatientFilesParams } from "@/dal/patient-files.dal";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  globalPatientFilesKey,
  usePatientFilesStore,
} from "@/stores/patient-files-store";
import { isInitialLoading } from "@/stores/query-state";

type GlobalPatientFilesFilters = Omit<GlobalPatientFilesParams, "clinicId">;

export function useGlobalPatientFiles(params: GlobalPatientFilesFilters) {
  const clinicId = useClinicId();
  const fetchGlobalPatientFiles = usePatientFilesStore(
    (state) => state.fetchGlobalPatientFiles,
  );
  const key = useMemo(
    () => (clinicId ? globalPatientFilesKey(clinicId, params) : null),
    [clinicId, params],
  );
  const entry = usePatientFilesStore((state) =>
    key ? state.globalFilesByQuery[key] : undefined,
  );

  const refresh = useCallback(() => {
    if (!clinicId) {
      return Promise.resolve();
    }

    return fetchGlobalPatientFiles(params);
  }, [clinicId, fetchGlobalPatientFiles, params]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return {
    data: entry?.data ?? null,
    error: entry?.error ?? null,
    isLoading: isInitialLoading(entry),
    isRefreshing: entry?.loading ?? false,
    refresh,
  };
}
