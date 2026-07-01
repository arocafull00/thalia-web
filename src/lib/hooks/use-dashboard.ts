import { useEffect } from "react";

import { useDashboardStore } from "@/stores/dashboard-store";
import { isInitialLoading } from "@/stores/query-state";

export function useDashboard() {
  const entry = useDashboardStore((state) => state.data);
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return {
    data: entry.data ?? undefined,
    isLoading: isInitialLoading(entry),
    error: entry.error,
    refresh: fetchDashboard,
  };
}
