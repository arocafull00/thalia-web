"use client";

import EmployeeAvatarDisplay from "@/components/employees/components/employee-avatar-display";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import { employeeRoleLabel } from "@/lib/format";
import type { Employee } from "@/types/database.types";

type EmployeeDetailHeaderProps = {
  employee: Employee;
};

export default function EmployeeDetailHeader({
  employee,
}: EmployeeDetailHeaderProps) {
  const isInactive = employee.active === false;
  const subtitleParts = [
    employeeRoleLabel(employee.role),
    employee.specialty,
    employee.phone,
    isInactive
      ? EMPLOYEE_DETAIL_COPY.status.inactive
      : EMPLOYEE_DETAIL_COPY.status.active,
  ].filter(Boolean);

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-6 pb-6 lg:px-8">
      <div className="flex items-center gap-4">
        <EmployeeAvatarDisplay employee={employee} />

        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold text-ink">
            {employee.full_name}
          </h1>
          {subtitleParts.length > 0 ? (
            <p className="text-sm text-ink-secondary">
              {subtitleParts.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
