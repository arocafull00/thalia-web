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

    let cancelled = false;

    void getClinicById(activeClinicId).then((data) => {
      if (cancelled) {
        return;
      }

      setClinic(data);
    });

    return () => {
      cancelled = true;
    };
  }, [activeClinicId, version]);

  return {
    clinic: resolvedClinic,
    loading: Boolean(activeClinicId && !resolvedClinic),
    refetch: () => setVersion((v) => v + 1),
  };
}
