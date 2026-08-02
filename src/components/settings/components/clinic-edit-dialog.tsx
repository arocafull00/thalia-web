"use client";

import ClinicEditForm from "@/components/settings/components/clinic-edit-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import {
  FORM_ACTION_ICONS,
  FORM_ACTION_ICON_CLASS,
} from "@/components/ui/primitives/form-action-icons";
import { CLINIC_EDIT_COPY } from "@/copy/clinic-edit-copy";
import { useClinicEditDialog } from "@/lib/hooks/use-clinic-edit-dialog";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";

type ClinicEditDialogProps = {
  clinic: ClinicInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function ClinicEditDialog({
  clinic,
  open,
  onOpenChange,
  onSuccess,
}: ClinicEditDialogProps) {
  const dialog = useClinicEditDialog(clinic, () => {
    onOpenChange(false);
    onSuccess();
  });

  const handleOpenChange = (nextOpen: boolean) => {
    onOpenChange(nextOpen);
  };

  const handleCancel = () => {
    dialog.reset();
    onOpenChange(false);
  };

  return (
    <AppDialog open={open} onOpenChange={handleOpenChange}>
      <AppSheetContent>
        <AppDialogHeader>
          <AppDialogTitle>{CLINIC_EDIT_COPY.title}</AppDialogTitle>
          <AppDialogDescription>
            {CLINIC_EDIT_COPY.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <ClinicEditForm register={dialog.register} errors={dialog.errors} />
        </div>
        <AppDialogFooter errorMessage={dialog.errors.root?.message}>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            <FORM_ACTION_ICONS.cancel
              className={FORM_ACTION_ICON_CLASS}
              aria-hidden="true"
            />
            {CLINIC_EDIT_COPY.actions.cancel}
          </Button>
          <ActionButton
            icon={FORM_ACTION_ICONS.save}
            title={
              dialog.isPending
                ? CLINIC_EDIT_COPY.actions.saving
                : CLINIC_EDIT_COPY.actions.save
            }
            disabled={dialog.isPending}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
