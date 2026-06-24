import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createWebPersistStorage } from "@/lib/web-storage";

import { supabase } from "@/lib/supabase";
import type { ClinicMembershipRole, ClinicMembershipStatus } from "@/types/database.types";

export type ClinicMembershipView = {
  id: string;
  clinicId: string;
  clinicName: string;
  clinicLogoUrl: string | null;
  role: ClinicMembershipRole;
  status: ClinicMembershipStatus;
};

type ClinicStore = {
  memberships: ClinicMembershipView[];
  activeClinicId: string | null;
  loading: boolean;
  hydrated: boolean;
  fetchMemberships: (userId: string) => Promise<ClinicMembershipView[]>;
  setActiveClinic: (clinicId: string) => void;
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
          const { data, error } = await supabase
            .from("clinic_memberships")
            .select("id, clinic_id, role, status, clinics(id, name, logo_url)")
            .eq("user_id", userId)
            .eq("status", "active");

          if (error) {
            throw new Error(error.message);
          }

          const memberships: ClinicMembershipView[] = (data ?? []).map((row) => {
            const clinicRaw = row.clinics as
              | { id: string; name: string; logo_url: string | null }
              | { id: string; name: string; logo_url: string | null }[]
              | null;
            const clinic = Array.isArray(clinicRaw) ? clinicRaw[0] : clinicRaw;

            return {
              id: row.id,
              clinicId: row.clinic_id,
              clinicName: clinic?.name ?? "Clínica",
              clinicLogoUrl: clinic?.logo_url ?? null,
              role: row.role as ClinicMembershipRole,
              status: row.status as ClinicMembershipStatus,
            };
          });

          const { activeClinicId } = get();
          const validActive =
            activeClinicId &&
            memberships.some((membership) => membership.clinicId === activeClinicId)
              ? activeClinicId
              : memberships.length === 1
                ? memberships[0].clinicId
                : null;

          set({ memberships, activeClinicId: validActive, loading: false });
          return memberships;
        } catch {
          set({ loading: false });
          return get().memberships;
        }
      },

      setActiveClinic: (clinicId) => {
        set({ activeClinicId: clinicId });
      },

      clearClinicState: () => {
        set({ memberships: [], activeClinicId: null, loading: false });
      },

      getActiveMembership: () => {
        const { memberships, activeClinicId } = get();

        if (!activeClinicId) {
          return null;
        }

        return memberships.find((membership) => membership.clinicId === activeClinicId) ?? null;
      },

      getExternalMemberships: () => {
        return get().memberships.filter((membership) => membership.role === "external");
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
