"use client";

import { Pencil, Phone, UserCheck, UserX } from "lucide-react";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import type { Employee } from "@/types/database.types";

type EmployeeQuickActionsProps = {
  employee: Employee;
  onEdit: () => void;
  onToggleStatus: () => void;
};

export default function EmployeeQuickActions({
  employee,
  onEdit,
  onToggleStatus,
}: EmployeeQuickActionsProps) {
  const isInactive = employee.active === false;

  return (
    <div className="flex flex-col gap-2 px-6 py-6">
      <div className="w-full [&>button]:w-full">
        <ActionButton
          title={EMPLOYEE_DETAIL_COPY.actions.edit}
          icon={Pencil}
          onClick={onEdit}
        />
      </div>
      {employee.phone ? (
        <div className="w-full [&>button]:w-full">
          <ActionButton
            title={EMPLOYEE_DETAIL_COPY.actions.call}
            icon={Phone}
            variant="ghost"
            onClick={() => {
              window.location.href = `tel:${employee.phone}`;
            }}
          />
        </div>
      ) : null}
      <div className="w-full [&>button]:w-full">
        <ActionButton
          title={
            isInactive
              ? EMPLOYEE_DETAIL_COPY.actions.activate
              : EMPLOYEE_DETAIL_COPY.actions.deactivate
          }
          icon={isInactive ? UserCheck : UserX}
          variant="ghost"
          onClick={onToggleStatus}
        />
      </div>
    </div>
  );
}
