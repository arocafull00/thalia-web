import { useEffect } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useClinicServerSeed } from "@/lib/hooks/use-server-seed";
import type { DashboardData } from "@/stores/dashboard-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { isInitialLoading } from "@/stores/query-state";

export function useDashboard(initialData?: DashboardData) {
  const entry = useDashboardStore((state) => state.data);
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchDashboard();
  }, [clinicId, fetchDashboard, hasClientData, seededData]);

  const data = entry.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry.error,
    refresh: fetchDashboard,
  };
}
