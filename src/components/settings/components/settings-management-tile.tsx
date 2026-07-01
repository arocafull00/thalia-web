"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

type SettingsManagementTileProps = {
  description: string;
  href: string;
  icon: LucideIcon;
  title: string;
};

export default function SettingsManagementTile({
  description,
  href,
  icon: Icon,
  title,
}: SettingsManagementTileProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/40 hover:bg-primary-subtle/25"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-subtle text-primary transition-colors group-hover:bg-primary group-hover:text-on-primary">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <p className="mt-1 text-xs text-ink-muted">{description}</p>
      </div>
      <ChevronRight
        className="h-4 w-4 text-ink-muted transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden="true"
      />
    </Link>
  );
}
