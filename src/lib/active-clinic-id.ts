import { useClinicStore } from "@/stores/clinic-store";

export function getActiveClinicId() {
  const activeClinicId = useClinicStore.getState().activeClinicId;

  return activeClinicId;
}
