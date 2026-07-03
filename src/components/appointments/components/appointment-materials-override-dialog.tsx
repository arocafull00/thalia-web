import AppointmentMaterialsOverrideForm from "@/components/appointments/components/appointment-materials-override-form";
import { useAppointmentMaterialsOverrideDialog } from "@/components/appointments/hooks/use-appointment-materials-override-dialog";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import type { AppointmentInventoryItemWithInventory } from "@/types/database.types";

type AppointmentMaterialsOverrideDialogProps = {
  open: boolean;
  appointmentId: string;
  initialItems: AppointmentInventoryItemWithInventory[];
  hasOverride: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AppointmentMaterialsOverrideDialog({
  open,
  appointmentId,
  initialItems,
  hasOverride,
  onOpenChange,
}: AppointmentMaterialsOverrideDialogProps) {
  const dialog = useAppointmentMaterialsOverrideDialog(
    appointmentId,
    initialItems,
    () => onOpenChange(false),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      dialog.reset();
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {APPOINTMENT_DETAIL_COPY.materialsDialogTitle}
          </AppDialogTitle>
          <AppDialogDescription>
            {APPOINTMENT_DETAIL_COPY.materialsDialogDescription}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <AppointmentMaterialsOverrideForm
            control={dialog.control}
            errors={dialog.errors}
          />
        </div>
        <AppDialogFooter>
          {hasOverride ? (
            <button
              type="button"
              onClick={() => {
                void dialog.resetToDefault();
              }}
              disabled={dialog.isPending}
              className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas disabled:opacity-50"
            >
              {APPOINTMENT_DETAIL_COPY.resetToDefault}
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
          >
            {APPOINTMENT_DETAIL_COPY.materialsCancel}
          </button>
          <ActionButton
            title={
              dialog.isPending
                ? APPOINTMENT_DETAIL_COPY.materialsSaving
                : APPOINTMENT_DETAIL_COPY.materialsSave
            }
            disabled={dialog.isPending}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
