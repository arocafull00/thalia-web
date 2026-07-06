import { Pencil, Phone, UserCheck, UserX } from "lucide-react";

import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import type { Employee } from "@/types/database.types";

type EmployeeDetailActionHandlers = {
  onEdit: () => void;
  onToggleStatus: () => void;
};

export function getEmployeeDetailActions(
  employee: Employee,
  handlers: EmployeeDetailActionHandlers,
): ProfileAction[] {
  const isInactive = employee.active === false;
  const actions: ProfileAction[] = [
    {
      label: EMPLOYEE_DETAIL_COPY.actions.edit,
      icon: Pencil,
      onClick: handlers.onEdit,
      buttonVariant: "solid",
    },
  ];

  if (employee.phone) {
    actions.push({
      label: EMPLOYEE_DETAIL_COPY.actions.call,
      icon: Phone,
      href: `tel:${employee.phone}`,
      buttonVariant: "ghost",
    });
  }

  actions.push({
    label: isInactive
      ? EMPLOYEE_DETAIL_COPY.actions.activate
      : EMPLOYEE_DETAIL_COPY.actions.deactivate,
    icon: isInactive ? UserCheck : UserX,
    onClick: handlers.onToggleStatus,
    buttonVariant: "ghost",
    variant: isInactive ? "default" : "danger",
  });

  return actions;
}
