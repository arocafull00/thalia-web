"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

import { useFileUrl } from "@/lib/hooks/use-file-url";

type AppointmentPersonAvatarProps = {
  name: string;
  avatarUrl: string | null;
  fallbackClassName?: string;
  fallbackStyle?: CSSProperties;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }

  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}

export default function AppointmentPersonAvatar({
  name,
  avatarUrl,
  fallbackClassName = "bg-primary-subtle text-primary",
  fallbackStyle,
}: AppointmentPersonAvatarProps) {
  const resolvedAvatarUrl = useFileUrl(avatarUrl);

  return (
    <div
      className={`relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ${fallbackClassName}`}
      style={!resolvedAvatarUrl ? fallbackStyle : undefined}
    >
      {resolvedAvatarUrl ? (
        <Image
          src={resolvedAvatarUrl}
          alt=""
          fill
          sizes="48px"
          unoptimized
          className="object-cover"
        />
      ) : (
        <span className="text-sm font-medium">{getInitials(name)}</span>
      )}
    </div>
  );
}
