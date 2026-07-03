"use client";

import { Phone } from "lucide-react";
import Image from "next/image";
import type { CSSProperties } from "react";

import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { EMPLOYEE_DETAIL_COPY } from "@/copy/employee-detail-copy";
import { employeeRoleLabel } from "@/lib/format";
import { useFileUrl } from "@/lib/hooks/use-file-url";
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
  const avatarStyle = getAvatarStyle(employee.color);
  const hasCustomColor = Boolean(employee.color);
  const initials = getProfileInitials(employee.full_name);

  return (
    <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
      <div
        className={`flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full ${
          hasCustomColor
            ? "text-on-primary"
            : "bg-primary-subtle text-primary ring-2 ring-border ring-offset-2"
        }`}
        style={avatarStyle}
      >
        {resolvedAvatarUrl ? (
          <Image
            src={resolvedAvatarUrl}
            alt=""
            width={80}
            height={80}
            unoptimized
            className="size-full object-cover"
          />
        ) : (
          <span className="text-xl font-semibold">{initials}</span>
        )}
      </div>

      <div className="min-w-0 space-y-3">
        <h1 className="text-xl font-semibold text-ink text-wrap-balance">
          {employee.full_name}
        </h1>

        <div className="flex flex-wrap justify-center gap-2">
          <span className="rounded-full bg-border px-2.5 py-1 text-xs font-medium text-ink-secondary">
            {employeeRoleLabel(employee.role)}
          </span>
          {employee.specialty ? (
            <span className="rounded-full bg-primary-subtle px-2.5 py-1 text-xs font-medium text-ink-secondary">
              {employee.specialty}
            </span>
          ) : null}
          <span
            className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${
              isInactive
                ? "bg-danger-subtle text-danger"
                : "bg-success-subtle text-success"
            }`}
          >
            {isInactive
              ? EMPLOYEE_DETAIL_COPY.status.inactive
              : EMPLOYEE_DETAIL_COPY.status.active}
          </span>
        </div>

        {employee.phone ? (
          <a
            href={`tel:${employee.phone}`}
            className="inline-flex items-center justify-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
          >
            <Phone
              className="size-4 shrink-0 text-ink-muted"
              aria-hidden="true"
            />
            <span>{employee.phone}</span>
          </a>
        ) : null}
      </div>
    </div>
  );
}
