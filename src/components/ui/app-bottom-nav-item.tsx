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
      data-cuelume-hover="tick"
      className={`flex min-h-12 flex-col items-center justify-center gap-0.5 px-2 text-[11px] transition motion-reduce:transition-none ${
        active ? "text-primary" : "text-ink-muted hover:text-ink-secondary"
      }`}
    >
      <span className="flex min-h-9 min-w-9 items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
