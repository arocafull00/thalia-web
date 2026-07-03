"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

type SettingsManagementLinkProps = {
  description: string;
  href: string;
  icon: LucideIcon;
  title: string;
};

export default function SettingsManagementLink({
  description,
  href,
  icon: Icon,
  title,
}: SettingsManagementLinkProps) {
  return (
    <Link
      href={href}
      className="group flex w-full items-center gap-3 py-4 text-left transition-colors hover:bg-canvas"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        <Icon className="size-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <ChevronRight
        className="size-4 shrink-0 text-ink-muted"
        aria-hidden="true"
      />
    </Link>
  );
}
