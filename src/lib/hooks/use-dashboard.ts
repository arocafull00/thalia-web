import { useEffect } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useClinicServerSeed } from "@/lib/hooks/use-server-seed";
import type { DashboardData } from "@/stores/dashboard-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { isInitialLoading, isQueryFresh, shouldFetchQuery } from "@/stores/query-state";

export function useDashboard(initialData?: DashboardData) {
  const entry = useDashboardStore((state) => state.data);
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);

  useEffect(() => {
    if (seededData !== undefined || !shouldFetchQuery(entry)) {
      return;
    }

    void fetchDashboard();
  }, [clinicId, entry, fetchDashboard, seededData]);

  const data = isQueryFresh(entry)
    ? entry.data
    : (seededData ?? entry.data);

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry.error,
    refresh: fetchDashboard,
  };
}
