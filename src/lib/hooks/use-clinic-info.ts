"use client";

import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { useClinicInfoStore, type ClinicInfo } from "@/stores/clinic-info-store";
import { useClinicStore } from "@/stores/clinic-store";

export type { ClinicInfo };

export function useClinicInfo(initialClinic?: ClinicInfo | null) {
  const activeClinicId = useClinicStore((state) => state.activeClinicId);
  const entry = useClinicInfoStore((state) => activeClinicId ? state.byId[activeClinicId] : undefined);
  const fetchClinic = useClinicInfoStore((state) => state.fetchClinic);
  useRevalidateOnEntry(activeClinicId ? `clinic-info:${activeClinicId}` : null, () => fetchClinic(activeClinicId!));
  const clinic = entry?.data ?? (initialClinic?.id === activeClinicId ? initialClinic : null);

  return {
    clinic,
    loading: Boolean(activeClinicId && !clinic),
    refetch: () => activeClinicId ? fetchClinic(activeClinicId) : Promise.resolve(),
  };
}
