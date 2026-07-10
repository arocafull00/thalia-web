import { useEffect } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useDashboardStore } from "@/stores/dashboard-store";
import { isInitialLoading } from "@/stores/query-state";

export function useDashboard() {
  const entry = useDashboardStore((state) => state.data);
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);
  const clinicId = useClinicId();

  useEffect(() => {
    void fetchDashboard();
  }, [clinicId, fetchDashboard]);

  return {
    data: entry.data ?? undefined,
    isLoading: isInitialLoading(entry),
    error: entry.error,
    refresh: fetchDashboard,
  };
}
