"use client";

import { toast } from "react-toastify";

import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { EMPLOYEE_STATUS_COPY } from "@/copy/employee-status-copy";
import { useUpdateEmployee } from "@/lib/hooks/use-employees";
import type { Employee } from "@/types/database.types";

type EmployeeStatusConfirmDialogProps = {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
};

export default function EmployeeStatusConfirmDialog({
  employee,
  open,
  onOpenChange,
  onSuccess,
}: EmployeeStatusConfirmDialogProps) {
  const { mutate, isPending } = useUpdateEmployee();
  const isActive = employee.active !== false;
  const copy = isActive
    ? EMPLOYEE_STATUS_COPY.deactivate
    : EMPLOYEE_STATUS_COPY.activate;

  const handleConfirm = () => {
    mutate(
      {
        id: employee.id,
        values: { active: !isActive },
      },
      {
        onSuccess: () => {
          toast.success(copy.success);
          onOpenChange(false);
          onSuccess();
        },
        onError: (cause) => {
          toast.error(cause.message || copy.error);
        },
      },
    );
  };

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title={copy.title}
      description={copy.description(employee.full_name)}
      confirmLabel={copy.confirm}
      cancelLabel={EMPLOYEE_STATUS_COPY.cancel}
      pendingLabel={copy.saving}
      isPending={isPending}
      onConfirm={handleConfirm}
      confirmTone={isActive ? "danger" : "primary"}
    />
  );
}
