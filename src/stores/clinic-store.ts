import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getMemberships } from "@/dal/clinics.dal";
import { writeActiveClinicCookie } from "@/lib/active-clinic-cookie";
import { createWebPersistStorage } from "@/lib/web-storage";
import type { ClinicMembershipView } from "@/types/clinic-membership";
import type {
  ClinicMembershipRole,
  ClinicMembershipStatus,
} from "@/types/database.types";

type ClinicStore = {
  memberships: ClinicMembershipView[];
  activeClinicId: string | null;
  loading: boolean;
  hydrated: boolean;
  fetchMemberships: (userId: string) => Promise<ClinicMembershipView[]>;
  setActiveClinic: (clinicId: string) => void;
  updateActiveClinicTimezone: (timezone: string) => void;
  clearClinicState: () => void;
  getActiveMembership: () => ClinicMembershipView | null;
  getExternalMemberships: () => ClinicMembershipView[];
};

export const useClinicStore = create<ClinicStore>()(
  persist(
    (set, get) => ({
      memberships: [],
      activeClinicId: null,
      loading: false,
      hydrated: false,

      fetchMemberships: async (userId) => {
        set({ loading: true });

        try {
          const rows = await getMemberships(userId);

          const memberships: ClinicMembershipView[] = rows.map((row) => {
            const clinicRaw = row.clinics as
              | {
                  id: string;
                  name: string;
                  logo_url: string | null;
                  timezone: string | null;
                }
              | {
                  id: string;
                  name: string;
                  logo_url: string | null;
                  timezone: string | null;
                }[]
              | null;
            const clinic = Array.isArray(clinicRaw) ? clinicRaw[0] : clinicRaw;

            return {
              id: row.id,
              clinicId: row.clinic_id,
              clinicName: clinic?.name ?? "Clínica",
              clinicLogoUrl: clinic?.logo_url ?? null,
              clinicTimezone: clinic?.timezone ?? null,
              role: row.role as ClinicMembershipRole,
              status: row.status as ClinicMembershipStatus,
            };
          });

          const { activeClinicId } = get();
          const validActive =
            activeClinicId &&
            memberships.some(
              (membership) => membership.clinicId === activeClinicId,
            )
              ? activeClinicId
              : (memberships[0]?.clinicId ?? null);

          set({ memberships, activeClinicId: validActive, loading: false });
          writeActiveClinicCookie(validActive);
          return memberships;
        } catch {
          set({ loading: false });
          return get().memberships;
        }
      },

      setActiveClinic: (clinicId) => {
        set({ activeClinicId: clinicId });
        writeActiveClinicCookie(clinicId);
      },

      updateActiveClinicTimezone: (timezone) => {
        const { activeClinicId, memberships } = get();
        set({
          memberships: memberships.map((membership) =>
            membership.clinicId === activeClinicId
              ? { ...membership, clinicTimezone: timezone }
              : membership,
          ),
        });
      },

      clearClinicState: () => {
        set({ memberships: [], activeClinicId: null, loading: false });
        writeActiveClinicCookie(null);
      },

      getActiveMembership: () => {
        const { memberships, activeClinicId } = get();

        if (!activeClinicId) {
          return null;
        }

        return (
          memberships.find(
            (membership) => membership.clinicId === activeClinicId,
          ) ?? null
        );
      },

      getExternalMemberships: () => {
        return get().memberships.filter(
          (membership) => membership.role === "external",
        );
      },
    }),
    {
      name: "thalia-clinic",
      storage: createWebPersistStorage(),
      partialize: (state) => ({ activeClinicId: state.activeClinicId }),
      onRehydrateStorage: () => () => {
        useClinicStore.setState({ hydrated: true });
      },
    },
  ),
);

useClinicStore.persist.onFinishHydration(() => {
  useClinicStore.setState({ hydrated: true });
});

if (useClinicStore.persist.hasHydrated()) {
  useClinicStore.setState({ hydrated: true });
}
