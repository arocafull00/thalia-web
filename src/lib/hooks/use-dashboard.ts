import { useCallback, useEffect } from "react";

import { useDashboardStore } from "@/stores/dashboard-store";

export function useDashboard() {
  const entry = useDashboardStore((state) => state.data);
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return {
    data: entry.data ?? undefined,
    isLoading: entry.loading,
    error: entry.error,
    refresh: fetchDashboard,
  };
}
