import { useEffect, useMemo } from "react";

import { useAppointmentsStore } from "@/stores/appointments-store";
import { isInitialLoading } from "@/stores/query-state";
import type { AppointmentWithRelations } from "@/types/database.types";

function defaultMaterialsKey(treatmentIds: string[]) {
  return [...treatmentIds].sort().join(",");
}

export function useAppointmentMaterials(
  appointment: AppointmentWithRelations | undefined,
) {
  const appointmentId = appointment?.id ?? "";
  const treatmentIds = useMemo(
    () =>
      appointment?.appointment_treatments.map((entry) => entry.treatment_id) ??
      [],
    [appointment?.appointment_treatments],
  );
  const materialsKey = defaultMaterialsKey(treatmentIds);

  const inventoryEntry = useAppointmentsStore(
    (state) => state.appointmentInventoryById[appointmentId],
  );
  const defaultsEntry = useAppointmentsStore(
    (state) => state.defaultMaterialsByKey[materialsKey],
  );
  const fetchAppointmentInventoryItems = useAppointmentsStore(
    (state) => state.fetchAppointmentInventoryItems,
  );
  const fetchDefaultMaterials = useAppointmentsStore(
    (state) => state.fetchDefaultMaterials,
  );

  useEffect(() => {
    if (!appointmentId) {
      return;
    }

    void fetchAppointmentInventoryItems(appointmentId);
  }, [appointmentId, fetchAppointmentInventoryItems]);

  useEffect(() => {
    if (treatmentIds.length === 0) {
      return;
    }

    void fetchDefaultMaterials(treatmentIds);
  }, [fetchDefaultMaterials, materialsKey, treatmentIds]);

  const overrideItems = inventoryEntry?.data ?? [];
  const defaultMaterials = defaultsEntry?.data ?? [];
  const hasOverride = overrideItems.length > 0;

  const effectiveMaterials = hasOverride
    ? overrideItems.map((item) => ({
        inventory_item_id: item.inventory_item_id,
        quantity: item.quantity,
        name: item.inventory_items?.name ?? "Material",
        unit: item.inventory_items?.unit ?? null,
      }))
    : defaultMaterials;

  const isLoading =
    isInitialLoading(inventoryEntry) ||
    (treatmentIds.length > 0 && isInitialLoading(defaultsEntry));
  const error = inventoryEntry?.error ?? defaultsEntry?.error ?? null;

  return {
    effectiveMaterials,
    hasOverride,
    isLoading,
    error,
    overrideItems,
    defaultMaterials,
  };
}
