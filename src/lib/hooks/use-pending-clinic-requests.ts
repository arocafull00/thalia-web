import { useCallback, useEffect, useState } from "react";

import { normalizeEmail, type PendingClinicRequest } from "@/lib/clinic-requests";
import { supabase } from "@/lib/supabase";

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
  const [requests, setRequests] = useState<PendingClinicRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!enabled || !email) {
      setRequests([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const normalizedEmail = normalizeEmail(email);
    const now = new Date().toISOString();

    const { data, error: fetchError } = await supabase
      .from("invitation_tokens")
      .select("token, role, expires_at, clinics(name)")
      .eq("email", normalizedEmail)
      .is("used_at", null)
      .gt("expires_at", now);

    if (fetchError) {
      setError(fetchError.message);
      setRequests([]);
      setLoading(false);
      return;
    }

    const mapped = (data ?? []).flatMap((row) => {
      const clinicRaw = row.clinics as { name: string } | { name: string }[] | null;
      const clinic = Array.isArray(clinicRaw) ? clinicRaw[0] : clinicRaw;

      if (!clinic?.name) {
        return [];
      }

      return [
        {
          token: row.token,
          clinicName: clinic.name,
          role: row.role,
          expiresAt: row.expires_at,
        },
      ];
    });

    setRequests(mapped);
    setLoading(false);
  }, [email, enabled]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { requests, loading, error, refresh };
}
