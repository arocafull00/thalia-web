"use client";

import EmployeeEditForm from "@/components/employees/components/employee-edit-form";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { EMPLOYEE_EDIT_COPY } from "@/copy/employee-edit-copy";
import { useEmployeeEditDialog } from "@/lib/hooks/use-employee-edit-dialog";
import type { Employee } from "@/types/database.types";

type EmployeeEditDialogProps = {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function EmployeeEditDialog({
  employee,
  open,
  onOpenChange,
  onSuccess,
}: EmployeeEditDialogProps) {
  const dialog = useEmployeeEditDialog(employee, () => {
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
          <AppDialogTitle>{EMPLOYEE_EDIT_COPY.title}</AppDialogTitle>
          <AppDialogDescription>
            {EMPLOYEE_EDIT_COPY.description}
          </AppDialogDescription>
        </AppDialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1">
          <EmployeeEditForm
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
            {EMPLOYEE_EDIT_COPY.actions.cancel}
          </button>
          <ActionButton
            title={
              dialog.isPending
                ? EMPLOYEE_EDIT_COPY.actions.saving
                : EMPLOYEE_EDIT_COPY.actions.save
            }
            disabled={dialog.isPending}
            onClick={dialog.handleSubmit}
          />
        </AppDialogFooter>
      </AppSheetContent>
    </AppDialog>
  );
}
