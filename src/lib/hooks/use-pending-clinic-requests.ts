import { useCallback, useState } from "react";

import { lookupEmployeeInvitationsByEmail } from "@/dal/employees.dal";
import {
  normalizeEmail,
  type PendingClinicRequest,
} from "@/lib/clinic-requests";

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

    let data;

    try {
      data = await lookupEmployeeInvitationsByEmail(normalizeEmail(email));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
      setRequests([]);
      setLoading(false);
      return;
    }

    const mapped = data.flatMap((row) => {
      const clinicRaw = row.clinics as
        { name: string } | { name: string }[] | null;
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

  return { requests, loading, error, refresh };
}
