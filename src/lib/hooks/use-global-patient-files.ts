"use client";

import { useCallback, useEffect, useMemo } from "react";

import type {
  GlobalPatientFilesParams,
  PaginatedPatientFiles,
} from "@/dal/patient-files.dal";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import {
  globalPatientFilesKey,
  usePatientFilesStore,
} from "@/stores/patient-files-store";
import { isInitialLoading, isQueryFresh, shouldFetchQuery } from "@/stores/query-state";

type GlobalPatientFilesFilters = Omit<GlobalPatientFilesParams, "clinicId">;

type GlobalPatientFilesSeed = {
  initialPage?: PaginatedPatientFiles;
  initialQuery?: GlobalPatientFilesFilters;
};

export function useGlobalPatientFiles(
  params: GlobalPatientFilesFilters,
  seed?: GlobalPatientFilesSeed,
) {
  const clinicId = useClinicId();
  const fetchGlobalPatientFiles = usePatientFilesStore(
    (state) => state.fetchGlobalPatientFiles,
  );
  const seedGlobalPatientFiles = usePatientFilesStore(
    (state) => state.seedGlobalPatientFiles,
  );
  const key = useMemo(
    () => (clinicId ? globalPatientFilesKey(clinicId, params) : null),
    [clinicId, params],
  );
  const entry = usePatientFilesStore((state) =>
    key ? state.globalFilesByQuery[key] : undefined,
  );
  const seededResult = useServerSeed(
    key ?? "",
    seed?.initialQuery && clinicId
      ? globalPatientFilesKey(clinicId, seed.initialQuery)
      : "",
    seed?.initialPage,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededResult === undefined || hasClientData) {
      return;
    }

    seedGlobalPatientFiles(params, seededResult);
  }, [hasClientData, params, seedGlobalPatientFiles, seededResult]);

  const refresh = useCallback(() => {
    if (!clinicId) {
      return Promise.resolve();
    }

    return fetchGlobalPatientFiles(params);
  }, [clinicId, fetchGlobalPatientFiles, params]);

  useEffect(() => {
    if (seededResult !== undefined || !shouldFetchQuery(entry)) {
      return;
    }

    void refresh();
  }, [entry, refresh, seededResult]);

  const resolved = isQueryFresh(entry)
    ? entry!.data
    : (seededResult ?? entry?.data ?? null);

  return {
    data: resolved,
    error: entry?.error ?? null,
    isLoading: resolved == null && isInitialLoading(entry),
    isRefreshing: entry?.loading ?? false,
    refresh,
  };
}
