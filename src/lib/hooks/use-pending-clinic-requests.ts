import { useCallback, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import type { PendingClinicRequest } from "@/lib/clinic-requests";
import { useClinicRequestsStore } from "@/stores/clinic-requests-store";

type UsePendingClinicRequestsResult = {
  requests: PendingClinicRequest[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

export function usePendingClinicRequests(
  email: string | undefined,
  enabled = true,
): UsePendingClinicRequestsResult {
  const { entry, fetchRequests, clearRequests } = useClinicRequestsStore(
    useShallow((state) => ({
      entry: state.requests,
      fetchRequests: state.fetchRequests,
      clearRequests: state.clearRequests,
    })),
  );

  useEffect(() => {
    if (!enabled || !email) {
      clearRequests();
      return;
    }

    void fetchRequests(email);
  }, [clearRequests, email, enabled, fetchRequests]);

  const refresh = useCallback(async () => {
    if (!enabled || !email) {
      clearRequests();
      return;
    }

    await fetchRequests(email, true);
  }, [clearRequests, email, enabled, fetchRequests]);

  return {
    requests: entry.data ?? [],
    loading: entry.loading,
    error: entry.error?.message ?? null,
    refresh,
  };
}
