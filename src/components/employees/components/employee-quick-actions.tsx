"use client";

import { getEmployeeDetailActions } from "@/components/employees/employee-detail-actions";
import ProfileQuickActionButton from "@/components/ui/profile/profile-quick-action-button";
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
  const actions = getEmployeeDetailActions(employee, {
    onEdit,
    onToggleStatus,
  });

  return (
    <div className="flex flex-col gap-2 px-6 py-6">
      {actions.map((action) => (
        <ProfileQuickActionButton
          key={action.label}
          label={action.label}
          icon={action.icon}
          variant={action.buttonVariant ?? "solid"}
          onClick={
            action.onClick ??
            (() => {
              if (action.href) {
                window.location.href = action.href;
              }
            })
          }
        />
      ))}
    </div>
  );
}
