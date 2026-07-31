import { useShallow } from "zustand/react/shallow";

import { useServerBootstrap } from "@/components/providers/store-hydrator";
import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";

export function useActiveClinic() {
  const bootstrap = useServerBootstrap();
  const { profile, initialized, sessionUserId } = useAuthStore(
    useShallow((state) => ({
      profile: state.profile,
      initialized: state.initialized,
      sessionUserId: state.session?.user.id ?? null,
    })),
  );
  const { memberships, activeClinicId, loading, setActiveClinic } =
    useClinicStore(
      useShallow((state) => ({
        memberships: state.memberships,
        activeClinicId: state.activeClinicId,
        loading: state.loading,
        setActiveClinic: state.setActiveClinic,
      })),
    );

  const canUseBootstrap = Boolean(
    bootstrap?.user && (!initialized || sessionUserId === bootstrap.user.id),
  );
  const resolvedProfile =
    profile ?? (canUseBootstrap ? (bootstrap?.profile ?? null) : null);
  const resolvedMemberships =
    memberships.length > 0
      ? memberships
      : canUseBootstrap
        ? (bootstrap?.memberships ?? [])
        : [];
  const resolvedActiveClinicId =
    activeClinicId ??
    (canUseBootstrap ? (bootstrap?.activeClinicId ?? null) : null);
  const membership =
    resolvedMemberships.find(
      (item) => item.clinicId === resolvedActiveClinicId,
    ) ?? null;
  const clinicId = resolvedActiveClinicId ?? resolvedProfile?.clinic_id ?? null;

  return {
    clinicId,
    clinicName: membership?.clinicName ?? null,
    clinicLogoUrl: membership?.clinicLogoUrl ?? null,
    membership,
    platformRole: membership?.role ?? null,
    memberships: resolvedMemberships,
    loading: loading && !canUseBootstrap,
    setActiveClinic,
  };
}

export function useClinicId() {
  const { clinicId } = useActiveClinic();
  return clinicId;
}
