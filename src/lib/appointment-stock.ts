import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

export type AppointmentStockIssue = {
  inventoryItemId: string;
  itemName: string;
  availableStock: number;
  requiredQuantity: number;
  unit: string | null;
  shortageCount: number;
};

type EffectiveMaterial = Omit<AppointmentStockIssue, "shortageCount">;

const activeStatuses = new Set<AppointmentStatus>([
  "scheduled",
  "confirmed",
  "in_progress",
]);

function addMaterial(
  materials: Map<string, EffectiveMaterial>,
  material: EffectiveMaterial,
) {
  const existing = materials.get(material.inventoryItemId);

  if (existing) {
    existing.requiredQuantity += material.requiredQuantity;
    return;
  }

  materials.set(material.inventoryItemId, material);
}

function getEffectiveMaterials(appointment: AppointmentWithRelations) {
  const materials = new Map<string, EffectiveMaterial>();
  const overrides = appointment.appointment_inventory_items ?? [];

  if (overrides.length > 0) {
    for (const override of overrides) {
      const inventoryItem = override.inventory_items;

      if (!inventoryItem) {
        continue;
      }

      addMaterial(materials, {
        inventoryItemId: inventoryItem.id,
        itemName: inventoryItem.name,
        availableStock: Number(inventoryItem.stock ?? 0),
        requiredQuantity: Number(override.quantity),
        unit: inventoryItem.unit,
      });
    }

    return [...materials.values()];
  }

  for (const appointmentTreatment of appointment.appointment_treatments) {
    const treatmentMaterials =
      appointmentTreatment.treatment?.treatment_inventory_items ?? [];

    for (const treatmentMaterial of treatmentMaterials) {
      const inventoryItem = treatmentMaterial.inventory_items;

      if (!inventoryItem) {
        continue;
      }

      addMaterial(materials, {
        inventoryItemId: inventoryItem.id,
        itemName: inventoryItem.name,
        availableStock: Number(inventoryItem.stock ?? 0),
        requiredQuantity: Number(treatmentMaterial.quantity),
        unit: inventoryItem.unit,
      });
    }
  }

  return [...materials.values()];
}

export function getAppointmentStockIssue(
  appointment: AppointmentWithRelations,
): AppointmentStockIssue | null {
  if (!appointment.status || !activeStatuses.has(appointment.status)) {
    return null;
  }

  const shortages = getEffectiveMaterials(appointment)
    .filter((material) => material.availableStock < material.requiredQuantity)
    .sort((left, right) => {
      const deficitDifference =
        right.requiredQuantity -
        right.availableStock -
        (left.requiredQuantity - left.availableStock);

      if (deficitDifference !== 0) {
        return deficitDifference;
      }

      return left.inventoryItemId.localeCompare(right.inventoryItemId);
    });

  const primaryShortage = shortages[0];

  if (!primaryShortage) {
    return null;
  }

  return {
    ...primaryShortage,
    shortageCount: shortages.length,
  };
}
