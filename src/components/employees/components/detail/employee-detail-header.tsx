"use client";

import { Badge } from "@/components/ui/badge";
import { ProfileIdentitySummary } from "@/components/ui/profile/profile-identity-summary";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import { employeeRoleLabel } from "@/lib/format";
import type { Employee } from "@/types/database.types";

import EmployeeAvatarDisplay from "./employee-avatar-display";

type EmployeeDetailHeaderProps = {
  employee: Employee;
};

export default function EmployeeDetailHeader({
  employee,
}: EmployeeDetailHeaderProps) {
  const isInactive = employee.active === false;

  return (
    <header className="shrink-0 border-b border-border-subtle bg-surface">
      <div className="flex flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <EmployeeAvatarDisplay employee={employee} />

          <ProfileIdentitySummary
            name={employee.full_name}
            specialty={employee.specialty}
            phone={employee.phone}
            badges={
              <>
                <Badge variant="purple">
                  {employeeRoleLabel(employee.role)}
                </Badge>
                <Badge variant={isInactive ? "danger" : "success"}>
                  {isInactive
                    ? EMPLOYEE_DETAIL_COPY.status.inactive
                    : EMPLOYEE_DETAIL_COPY.status.active}
                </Badge>
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}
