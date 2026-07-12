import { Package, Pencil } from "lucide-react";
import { useState } from "react";

import AppointmentDetailCard from "@/components/appointments/components/appointment-detail-card";
import AppointmentMaterialsOverrideDialog from "@/components/appointments/components/appointment-materials-override-dialog";
import { useAppointmentMaterials } from "@/components/appointments/hooks/use-appointment-materials";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import type { EffectiveAppointmentMaterial } from "@/lib/appointment-inventory";
import type {
  AppointmentInventoryItemWithInventory,
  AppointmentWithRelations,
} from "@/types/database.types";

type AppointmentMaterialsSectionProps = {
  appointment: AppointmentWithRelations;
};

function toDialogInitialItems(
  appointmentId: string,
  overrideItems: AppointmentInventoryItemWithInventory[],
  defaultMaterials: EffectiveAppointmentMaterial[],
): AppointmentInventoryItemWithInventory[] {
  if (overrideItems.length > 0) {
    return overrideItems;
  }

  return defaultMaterials.map((item) => ({
    id: "",
    appointment_id: appointmentId,
    inventory_item_id: item.inventory_item_id,
    quantity: item.quantity,
    created_at: null,
    inventory_items: {
      id: item.inventory_item_id,
      name: item.name,
      unit: item.unit,
    },
  }));
}

function formatQuantity(quantity: number, unit: string | null) {
  if (!unit) {
    return String(quantity);
  }

  return `${quantity} ${unit}`;
}

export default function AppointmentMaterialsSection({
  appointment,
}: AppointmentMaterialsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const materials = useAppointmentMaterials(appointment);
  const isCompleted = appointment.status === "completed";
  const canEdit = !isCompleted;

  const title = isCompleted
    ? APPOINTMENT_DETAIL_COPY.materialsConsumed
    : APPOINTMENT_DETAIL_COPY.materials;

  return (
    <>
      <AppointmentDetailCard icon={Package} title={title}>
        {materials.isLoading ? <SkeletonList count={2} /> : null}
        {materials.error ? (
          <Notice
            tone="danger"
            message={APPOINTMENT_DETAIL_COPY.materialsLoadError}
          />
        ) : null}

        {!materials.isLoading && !materials.error ? (
          <div className="space-y-4">
            <p className="text-sm text-ink-secondary">
              {materials.hasOverride
                ? APPOINTMENT_DETAIL_COPY.materialsOverride
                : APPOINTMENT_DETAIL_COPY.materialsDefault}
            </p>

            {materials.effectiveMaterials.length === 0 ? (
              <p className="text-sm text-ink-secondary">
                {APPOINTMENT_DETAIL_COPY.noMaterials}
              </p>
            ) : (
              <div className="divide-y divide-border-subtle">
                {materials.effectiveMaterials.map((item) => (
                  <div
                    key={item.inventory_item_id}
                    className="flex items-center justify-between gap-4 py-3 text-sm"
                  >
                    <span className="text-ink">{item.name}</span>
                    <span className="text-ink-secondary">
                      {formatQuantity(item.quantity, item.unit)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {canEdit ? (
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(true)}
                className="rounded-button px-3 py-1.5 text-sm"
              >
                <Pencil className="size-3.5" aria-hidden="true" />
                {APPOINTMENT_DETAIL_COPY.editMaterials}
              </Button>
            ) : null}
          </div>
        ) : null}
      </AppointmentDetailCard>

      <AppointmentMaterialsOverrideDialog
        open={dialogOpen}
        appointmentId={appointment.id}
        initialItems={toDialogInitialItems(
          appointment.id,
          materials.overrideItems,
          materials.defaultMaterials,
        )}
        hasOverride={materials.hasOverride}
        onOpenChange={setDialogOpen}
      />
    </>
  );
}
