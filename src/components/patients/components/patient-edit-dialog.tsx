"use client";

import PatientCreateForm from "@/components/patients/components/patient-create-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { PATIENT_EDIT_COPY } from "@/copy/patient-edit-copy";
import { usePatientEditDialog } from "@/lib/hooks/use-patient-edit-dialog";
import type { Patient } from "@/types/database.types";

type PatientEditDialogProps = {
  patient: Patient;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function PatientEditDialog({
  patient,
  open,
  onOpenChange,
  onSuccess,
}: PatientEditDialogProps) {
  const dialog = usePatientEditDialog(patient, () => {
    onOpenChange(false);
    onSuccess();
  });

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
          <AppDialogTitle>{PATIENT_EDIT_COPY.title}</AppDialogTitle>
          <AppDialogDescription>
            {PATIENT_EDIT_COPY.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <PatientCreateForm
            register={dialog.register}
            control={dialog.control}
            errors={dialog.errors}
          />
        </div>
        <AppDialogFooter>
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas"
          >
            {PATIENT_EDIT_COPY.actions.cancel}
          </button>
          <ActionButton
            title={
              dialog.isPending
                ? PATIENT_EDIT_COPY.actions.saving
                : PATIENT_EDIT_COPY.actions.save
            }
            disabled={dialog.isPending}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
