"use client";

import {
  getEmployeeDetailMenuSections,
  getEmployeeDetailPrimaryAction,
} from "@/components/employees/employee-detail-actions";
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
  const handlers = { onEdit, onToggleStatus };
  const primaryAction = getEmployeeDetailPrimaryAction(handlers);
  const menuActions = getEmployeeDetailMenuSections(employee, handlers).flatMap(
    (section) => section.actions,
  );
  const actions = [
    {
      label: primaryAction.title,
      icon: primaryAction.icon!,
      onClick: primaryAction.onClick,
      buttonVariant: "solid" as const,
    },
    ...menuActions.map((action) => ({
      label: action.label,
      icon: action.icon,
      onClick: action.onClick,
      href: action.href,
      buttonVariant: "ghost" as const,
    })),
  ];

  return (
    <div className="flex flex-col gap-2 px-6 py-6">
      {actions.map((action) => (
        <ProfileQuickActionButton
          key={action.label}
          label={action.label}
          icon={action.icon}
          variant={action.buttonVariant}
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
