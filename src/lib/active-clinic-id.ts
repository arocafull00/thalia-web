import { useAuthStore } from "@/stores/auth-store";
import { useClinicStore } from "@/stores/clinic-store";

export function getActiveClinicId() {
  const activeClinicId = useClinicStore.getState().activeClinicId;

  if (activeClinicId) {
    return activeClinicId;
  }

  return useAuthStore.getState().profile?.clinic_id ?? null;
}
