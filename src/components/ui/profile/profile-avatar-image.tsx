"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

type ProfileAvatarImageProps = {
  src: string | null;
  initials: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  avatarStyle?: CSSProperties;
  className?: string;
  fallbackClassName?: string;
  priority?: boolean;
};

const sizeClasses = {
  sm: "size-9",
  md: "size-16",
  lg: "size-20",
  xl: "size-24",
} as const;

const sizeHints = {
  sm: "72px",
  md: "128px",
  lg: "160px",
  xl: "192px",
} as const;

export function ProfileAvatarImage({
  src,
  initials,
  size = "lg",
  avatarStyle,
  className,
  fallbackClassName,
  priority = false,
}: ProfileAvatarImageProps) {
  const sizeClass = sizeClasses[size];

  return (
    <div
      className={`relative shrink-0 overflow-hidden rounded-full ${sizeClass} ${className ?? ""}`}
      style={avatarStyle}
    >
      {src ? (
        <Image
          src={src}
          alt=""
          fill
          sizes={sizeHints[size]}
          priority={priority}
          unoptimized
          className="object-cover"
        />
      ) : (
        <span
          className={`flex size-full items-center justify-center text-xl font-semibold ${fallbackClassName ?? ""}`}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
