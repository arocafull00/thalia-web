"use client";

import AppDialog from "@/components/ui/app-dialog";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { EMPLOYEE_EDIT_COPY } from "@/copy/employee-edit-copy";
import { useEmployeeEditDialog } from "@/lib/hooks/use-employee-edit-dialog";
import type { Employee } from "@/types/database.types";

import EmployeeEditForm from "./employee-edit-form";

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
        <AppDialogFooter errorMessage={dialog.errors.root?.message}>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            className="rounded-button px-3 py-1.5 text-sm"
          >
            {EMPLOYEE_EDIT_COPY.actions.cancel}
          </Button>
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
