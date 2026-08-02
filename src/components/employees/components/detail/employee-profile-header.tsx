"use client";

import type { CSSProperties } from "react";

import { Badge } from "@/components/ui/badge";
import { ProfileAvatarImage } from "@/components/ui/profile/profile-avatar-image";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { ProfileIdentitySummary } from "@/components/ui/profile/profile-identity-summary";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import { employeeRoleLabel } from "@/lib/format";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { resolveAvatarDisplayUri } from "@/lib/storage";
import type { Employee } from "@/types/database.types";

type EmployeeProfileHeaderProps = {
  employee: Employee;
};

function getAvatarStyle(
  color: string | null | undefined,
): CSSProperties | undefined {
  if (!color) {
    return undefined;
  }

  return {
    backgroundColor: color,
    boxShadow: `0 0 0 2px var(--canvas), 0 0 0 4px ${color}`,
  };
}

export default function EmployeeProfileHeader({
  employee,
}: EmployeeProfileHeaderProps) {
  const isInactive = employee.active === false;
  const resolvedAvatarUrl = useFileUrl(employee.avatar_url ?? null);
  const displayUri = resolveAvatarDisplayUri(
    resolvedAvatarUrl,
    employee.updated_at,
  );
  const avatarStyle = getAvatarStyle(employee.color);
  const hasCustomColor = Boolean(employee.color);
  const initials = getProfileInitials(employee.full_name);

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6 text-center lg:gap-4 lg:px-6 lg:py-8">
      <div className="rounded-full bg-surface p-0.5 ring-1 ring-border-subtle">
        <ProfileAvatarImage
          src={displayUri}
          initials={initials}
          size="lg"
          avatarStyle={avatarStyle}
          fallbackClassName={
            hasCustomColor
              ? "text-on-primary"
              : "bg-primary-subtle text-primary"
          }
        />
      </div>

      <ProfileIdentitySummary
        centered
        name={employee.full_name}
        specialty={employee.specialty}
        phone={employee.phone}
        badges={
          <>
            <Badge variant="purple">{employeeRoleLabel(employee.role)}</Badge>
            <Badge variant={isInactive ? "danger" : "success"}>
              {isInactive
                ? EMPLOYEE_DETAIL_COPY.status.inactive
                : EMPLOYEE_DETAIL_COPY.status.active}
            </Badge>
          </>
        }
      />
    </div>
  );
}
