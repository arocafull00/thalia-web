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

export function useClinicInfo() {
  const activeClinicId = useClinicStore((s) => s.activeClinicId);
  const [clinic, setClinic] = useState<ClinicInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (!activeClinicId) return;

    void getClinicById(activeClinicId).then((data) => {
      setClinic(data);
      setLoading(false);
    });
  }, [activeClinicId, version]);

  return { clinic, loading, refetch: () => setVersion((v) => v + 1) };
}
