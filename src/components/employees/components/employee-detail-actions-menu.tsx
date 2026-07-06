"use client";

import { getEmployeeDetailActions } from "@/components/employees/employee-detail-actions";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import type { Employee } from "@/types/database.types";

type EmployeeDetailActionsMenuProps = {
  employee: Employee;
  onEdit: () => void;
  onToggleStatus: () => void;
};

export default function EmployeeDetailActionsMenu({
  employee,
  onEdit,
  onToggleStatus,
}: EmployeeDetailActionsMenuProps) {
  const actions = getEmployeeDetailActions(employee, {
    onEdit,
    onToggleStatus,
  });

  return (
    <ProfileActionsMenu
      actions={actions}
      ariaLabel={EMPLOYEE_DETAIL_COPY.moreActions}
      className="lg:hidden"
    />
  );
}
