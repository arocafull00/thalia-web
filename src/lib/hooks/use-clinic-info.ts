"use client";

import { useEffect, useState } from "react";

import { getClinicById } from "@/dal/clinics.dal";
import { useClinicStore } from "@/stores/clinic-store";
import type { Clinic } from "@/types/database.types";

export type ClinicInfo = Pick<
  Clinic,
  | "id"
  | "name"
  | "address"
  | "phone"
  | "specialty"
  | "logo_url"
  | "opening_time"
  | "closing_time"
  | "open_days"
  | "timezone"
>;

export function useClinicInfo(initialClinic?: ClinicInfo | null) {
  const activeClinicId = useClinicStore((s) => s.activeClinicId);
  const [clinic, setClinic] = useState<ClinicInfo | null>(
    initialClinic ?? null,
  );
  const [loading, setLoading] = useState(!initialClinic);
  const [version, setVersion] = useState(0);
  const initialClinicMatches = initialClinic?.id === activeClinicId;
  const resolvedClinic =
    clinic?.id === activeClinicId
      ? clinic
      : initialClinicMatches
        ? initialClinic
        : null;

  useEffect(() => {
    if (!activeClinicId) {
      return;
    }

    if (initialClinicMatches && version === 0) {
      return;
    }

    void getClinicById(activeClinicId).then((data) => {
      setClinic(data);
      setLoading(false);
    });
  }, [activeClinicId, initialClinicMatches, version]);

  return {
    clinic: resolvedClinic,
    loading: Boolean(activeClinicId && !resolvedClinic) || loading,
    refetch: () => setVersion((v) => v + 1),
  };
}
