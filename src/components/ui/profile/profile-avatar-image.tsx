"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

type ProfileAvatarImageProps = {
  src: string | null;
  initials: ReactNode;
  size?: "md" | "lg" | "xl";
  avatarStyle?: CSSProperties;
  className?: string;
  fallbackClassName?: string;
};

const sizeClasses = {
  md: "size-16",
  lg: "size-20",
  xl: "size-24",
} as const;

const sizePixels = {
  md: 128,
  lg: 160,
  xl: 192,
} as const;

export function ProfileAvatarImage({
  src,
  initials,
  size = "lg",
  avatarStyle,
  className,
  fallbackClassName,
}: ProfileAvatarImageProps) {
  const dimension = sizePixels[size];
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
          width={dimension}
          height={dimension}
          sizes={`${dimension / 2}px`}
          unoptimized
          className="size-full object-cover"
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
