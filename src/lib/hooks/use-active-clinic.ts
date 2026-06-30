import { useShallow } from "zustand/react/shallow";

import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";

export function useActiveClinic() {
  const profile = useAuthStore((state) => state.profile);
  const { memberships, activeClinicId, loading, setActiveClinic } =
    useClinicStore(
      useShallow((state) => ({
        memberships: state.memberships,
        activeClinicId: state.activeClinicId,
        loading: state.loading,
        setActiveClinic: state.setActiveClinic,
      })),
    );

  const membership =
    memberships.find((item) => item.clinicId === activeClinicId) ?? null;
  const clinicId = activeClinicId ?? profile?.clinic_id ?? null;

  return {
    clinicId,
    clinicName: membership?.clinicName ?? null,
    clinicLogoUrl: membership?.clinicLogoUrl ?? null,
    membership,
    platformRole: membership?.role ?? null,
    memberships,
    loading,
    setActiveClinic,
  };
}

export function useClinicId() {
  const { clinicId } = useActiveClinic();
  return clinicId;
}
