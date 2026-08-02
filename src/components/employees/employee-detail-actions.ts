import { Pencil, Phone, UserCheck, UserX } from "lucide-react";

import type { ProfileActionSection } from "@/components/ui/profile/profile-action";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import type { TopbarActionButtonConfig } from "@/lib/hooks/use-topbar-actions";
import type { Employee } from "@/types/database.types";

type EmployeeDetailActionHandlers = {
  onEdit: () => void;
  onToggleStatus: () => void;
};

export function getEmployeeDetailPrimaryAction(
  handlers: EmployeeDetailActionHandlers,
): TopbarActionButtonConfig {
  return {
    title: EMPLOYEE_DETAIL_COPY.actions.edit,
    icon: Pencil,
    onClick: handlers.onEdit,
  };
}

export function getEmployeeDetailMenuSections(
  employee: Employee,
  handlers: EmployeeDetailActionHandlers,
): ProfileActionSection[] {
  const isInactive = employee.active === false;
  const sections: ProfileActionSection[] = [];

  if (employee.phone) {
    sections.push({
      label: EMPLOYEE_DETAIL_COPY.menuSections.contact,
      actions: [
        {
          label: EMPLOYEE_DETAIL_COPY.actions.call,
          icon: Phone,
          href: `tel:${employee.phone}`,
        },
      ],
    });
  }

  sections.push({
    label: EMPLOYEE_DETAIL_COPY.menuSections.status,
    actions: [
      {
        label: isInactive
          ? EMPLOYEE_DETAIL_COPY.actions.activate
          : EMPLOYEE_DETAIL_COPY.actions.deactivate,
        icon: isInactive ? UserCheck : UserX,
        onClick: handlers.onToggleStatus,
        variant: isInactive ? "default" : "danger",
      },
    ],
  });

  return sections;
}
