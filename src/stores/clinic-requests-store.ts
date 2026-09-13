import { create } from "zustand";

import {
  consumeEmployeeInvitation,
  lookupEmployeeInvitationsByEmail,
  type ConsumeEmployeeInvitationInput,
  type ConsumeEmployeeInvitationResult,
} from "@/dal/employees.dal";
import {
  normalizeEmail,
  type PendingClinicRequest,
} from "@/lib/clinic-requests";
import { logger } from "@/lib/logger";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import { resetClinicQueryData } from "@/stores/reset-clinic-query-data";

type ClinicRequestsStore = {
  requests: QueryEntry<PendingClinicRequest[]>;
  loadedEmail: string | null;
  respondingToken: string | null;
  responseError: Error | null;
  fetchRequests: (email: string, force?: boolean) => Promise<void>;
  respondToRequest: (
    input: ConsumeEmployeeInvitationInput,
    userId: string,
  ) => Promise<ConsumeEmployeeInvitationResult>;
  clearRequests: () => void;
  clearResponseError: () => void;
};

export const useClinicRequestsStore = create<ClinicRequestsStore>(
  (set, get) => ({
    requests: emptyQueryEntry(),
    loadedEmail: null,
    respondingToken: null,
    responseError: null,

    fetchRequests: async (email, force = false) => {
      const normalizedEmail = normalizeEmail(email);
      const current = get();

      if (
        !force &&
        current.loadedEmail === normalizedEmail &&
        (current.requests.loading || current.requests.data !== null)
      ) {
        return;
      }

      set({
        loadedEmail: normalizedEmail,
        requests: loadingQueryEntry(current.requests),
      });

      try {
        const data = await lookupEmployeeInvitationsByEmail(normalizedEmail);
        const requests = data.flatMap((row) => {
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

        if (get().loadedEmail !== normalizedEmail) {
          return;
        }

        set({ requests: successQueryEntry(requests) });
      } catch (cause) {
        const error = cause instanceof Error ? cause : new Error(String(cause));
        logger.captureException(error, {
          store: "clinic-requests-store",
          action: "fetchRequests",
        });

        if (get().loadedEmail === normalizedEmail) {
          set({ requests: errorQueryEntry(error, get().requests) });
        }
      }
    },

    respondToRequest: async (input, userId) => {
      set({ respondingToken: input.token, responseError: null });

      try {
        const result = await consumeEmployeeInvitation(input);
        const requests = get().requests.data ?? [];
        set({
          requests: successQueryEntry(
            requests.filter((request) => request.token !== input.token),
          ),
        });

        if ("clinicId" in result) {
          await Promise.all([
            useClinicStore.getState().fetchMemberships(userId),
            useAuthStore.getState().refreshProfile(),
          ]);
          useClinicStore.getState().setActiveClinic(result.clinicId);
          resetClinicQueryData();
        }

        return result;
      } catch (cause) {
        const error = cause instanceof Error ? cause : new Error(String(cause));
        logger.captureException(error, {
          store: "clinic-requests-store",
          action: "respondToRequest",
        });
        set({ responseError: error });
        throw error;
      } finally {
        set({ respondingToken: null });
      }
    },

    clearRequests: () => {
      set({
        requests: emptyQueryEntry(),
        loadedEmail: null,
        respondingToken: null,
        responseError: null,
      });
    },

    clearResponseError: () => set({ responseError: null }),
  }),
);
