"use client";

import { useState } from "react";

import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { EMPLOYEE_STATUS_COPY } from "@/copy/employee-status-copy";
import { useUpdateEmployee } from "@/lib/hooks/use-employees";
import { notifySuccess } from "@/lib/sound";
import type { Employee } from "@/types/database.types";

type EmployeeStatusConfirmDialogProps = {
  employee: Employee;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSetExternalMembershipStatus: (
    employeeId: string,
    status: "active" | "suspended",
  ) => Promise<void>;
  onSuccess: () => void;
};

export default function EmployeeStatusConfirmDialog({
  employee,
  open,
  onOpenChange,
  onSetExternalMembershipStatus,
  onSuccess,
}: EmployeeStatusConfirmDialogProps) {
  const { mutate, isPending } = useUpdateEmployee();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isActive = employee.active !== false;
  const copy = isActive
    ? EMPLOYEE_STATUS_COPY.deactivate
    : EMPLOYEE_STATUS_COPY.activate;

  const handleConfirm = () => {
    setErrorMessage(null);

    if (employee.account_type === "external") {
      void onSetExternalMembershipStatus(employee.id, "suspended")
        .then(() => {
          notifySuccess(copy.success);
          handleOpenChange(false);
          onSuccess();
        })
        .catch((cause) => {
          setErrorMessage(
            cause instanceof Error && cause.message
              ? cause.message
              : copy.error,
          );
        });
      return;
    }

    mutate(
      {
        id: employee.id,
        values: { active: !isActive },
      },
      {
        onSuccess: () => {
          notifySuccess(copy.success);
          handleOpenChange(false);
          onSuccess();
        },
        onError: (cause) => {
          setErrorMessage(cause.message || copy.error);
        },
      },
    );
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setErrorMessage(null);
    }

    onOpenChange(nextOpen);
  };

  return (
    <AppConfirmDialog
      open={open}
      onOpenChange={handleOpenChange}
      title={copy.title}
      description={copy.description(employee.full_name)}
      confirmLabel={copy.confirm}
      cancelLabel={EMPLOYEE_STATUS_COPY.cancel}
      pendingLabel={copy.saving}
      isPending={isPending}
      onConfirm={handleConfirm}
      confirmTone={isActive ? "danger" : "primary"}
      errorMessage={errorMessage ?? undefined}
    />
  );
}
