"use client";

import Link from "next/link";
import type { ReactNode } from "react";

type AppBottomNavItemProps = {
  href: string;
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick?: () => void;
};

export default function AppBottomNavItem({
  href,
  label,
  icon,
  active,
  onClick,
}: AppBottomNavItemProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={`flex min-h-14 flex-col items-center justify-center gap-0.5 px-2 text-xs transition motion-reduce:transition-none ${
        active ? "text-primary" : "text-ink-secondary hover:text-ink"
      }`}
    >
      <span className="flex min-h-11 min-w-11 items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
