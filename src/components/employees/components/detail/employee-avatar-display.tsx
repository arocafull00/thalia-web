"use client";

import type { CSSProperties } from "react";

import { ProfileAvatarImage } from "@/components/ui/profile/profile-avatar-image";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { resolveAvatarDisplayUri } from "@/lib/storage";
import type { Employee } from "@/types/database.types";

type EmployeeAvatarDisplayProps = {
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
    boxShadow: `0 0 0 2px var(--surface), 0 0 0 4px ${color}`,
  };
}

export default function EmployeeAvatarDisplay({
  employee,
}: EmployeeAvatarDisplayProps) {
  const resolvedAvatarUrl = useFileUrl(employee.avatar_url ?? null);
  const displayUri = resolveAvatarDisplayUri(
    resolvedAvatarUrl,
    employee.updated_at,
  );
  const avatarStyle = getAvatarStyle(employee.color);
  const hasCustomColor = Boolean(employee.color);
  const initials = getProfileInitials(employee.full_name);

  return (
    <div className="shrink-0 rounded-full bg-surface p-0.5 ring-1 ring-border-subtle">
      <ProfileAvatarImage
        src={displayUri}
        initials={initials}
        size="lg"
        avatarStyle={avatarStyle}
        fallbackClassName={
          hasCustomColor ? "text-on-primary" : "bg-primary-subtle text-primary"
        }
      />
    </div>
  );
}
