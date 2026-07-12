"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { useFileUrl } from "@/lib/hooks/use-file-url";
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
    boxShadow: `0 0 0 2px var(--canvas), 0 0 0 4px ${color}`,
  };
}

export default function EmployeeAvatarDisplay({
  employee,
}: EmployeeAvatarDisplayProps) {
  const resolvedAvatarUrl = useFileUrl(employee.avatar_url ?? null);
  const avatarStyle = getAvatarStyle(employee.color);
  const hasCustomColor = Boolean(employee.color);
  const initials = getProfileInitials(employee.full_name);

  return (
    <div
      className={`flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full ${
        hasCustomColor
          ? "text-on-primary"
          : "bg-primary-subtle text-primary ring-2 ring-border ring-offset-2 ring-offset-canvas"
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
  );
}
