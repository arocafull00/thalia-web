"use client";

import ClinicHoursConflictList from "@/components/settings/components/clinic-hours-conflict-list";
import ClinicHoursForm from "@/components/settings/components/clinic-hours-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { CLINIC_HOURS_COPY } from "@/copy/clinic-hours-copy";
import { useClinicHoursDialog } from "@/lib/hooks/use-clinic-hours-dialog";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";

type ClinicHoursDialogProps = {
  clinic: ClinicInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function ClinicHoursDialog({
  clinic,
  open,
  onOpenChange,
  onSuccess,
}: ClinicHoursDialogProps) {
  const dialog = useClinicHoursDialog(clinic, () => {
    onOpenChange(false);
    onSuccess();
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) dialog.reset();
    onOpenChange(nextOpen);
  };

  const hasConflicts = dialog.conflicts !== null && dialog.conflicts.length > 0;

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>
            {hasConflicts && dialog.conflicts
              ? CLINIC_HOURS_COPY.conflicts.title(dialog.conflicts.length)
              : CLINIC_HOURS_COPY.title}
          </AppDialogTitle>
          {!hasConflicts && (
            <AppDialogDescription>
              {CLINIC_HOURS_COPY.description}
            </AppDialogDescription>
          )}
        </AppDialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          {hasConflicts && dialog.conflicts ? (
            <ClinicHoursConflictList conflicts={dialog.conflicts} />
          ) : (
            <ClinicHoursForm
              register={dialog.register}
              control={dialog.control}
              errors={dialog.errors}
            />
          )}
        </div>

        <AppDialogFooter errorMessage={dialog.errors.root?.message}>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              hasConflicts ? dialog.cancelConflict() : handleOpenChange(false)
            }
            className="rounded-button px-3 py-1.5 text-sm"
          >
            {hasConflicts
              ? CLINIC_HOURS_COPY.conflicts.back
              : CLINIC_HOURS_COPY.actions.cancel}
          </Button>
          <ActionButton
            title={
              dialog.isPending
                ? CLINIC_HOURS_COPY.actions.saving
                : hasConflicts
                  ? CLINIC_HOURS_COPY.conflicts.confirm
                  : CLINIC_HOURS_COPY.actions.save
            }
            disabled={dialog.isPending}
            onClick={hasConflicts ? dialog.confirmSave : dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
