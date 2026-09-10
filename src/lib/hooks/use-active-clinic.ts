import { useShallow } from "zustand/react/shallow";

import { useServerBootstrap } from "@/components/providers/store-hydrator";
import { resolveAppointmentTimezone } from "@/lib/appointment-datetime";
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
    clinicTimezone: resolveAppointmentTimezone(membership?.clinicTimezone),
    membership,
    platformRole: membership?.role ?? null,
    memberships: resolvedMemberships,
    loading: loading && !canUseBootstrap,
    setActiveClinic,
  };
}

/**
 * El usuario es un profesional autónomo en la clínica activa.
 *
 * Sólo ve sus propias citas y los pacientes de esas citas (#99, #102), así que
 * enseñarle un selector de profesional sería ofrecerle filtrar por gente cuya
 * agenda no puede consultar: elegiría a otro y la lista saldría vacía.
 *
 * El filtro de verdad vive en RLS. Esto es únicamente para la interfaz.
 */
export function useIsExternalProfessional() {
  const { platformRole } = useActiveClinic();
  return platformRole === "external";
}

export function useClinicId() {
  const { clinicId } = useActiveClinic();
  return clinicId;
}

export function useActiveClinicTimezone() {
  const { clinicTimezone } = useActiveClinic();
  return clinicTimezone;
}
