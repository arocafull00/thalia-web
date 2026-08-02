"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

type SettingsNavItemProps = {
  href: string;
  label: string;
  active: boolean;
};

export default function SettingsNavItem({
  href,
  label,
  active,
}: SettingsNavItemProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        "block rounded-xl px-4 py-3 text-sm font-medium transition-colors",
        active
          ? "bg-primary-subtle text-primary"
          : "text-ink-secondary hover:bg-canvas hover:text-ink",
      )}
    >
      {label}
    </Link>
  );
}
