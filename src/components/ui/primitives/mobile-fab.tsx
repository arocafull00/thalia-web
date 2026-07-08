"use client";

import { Plus, type LucideIcon } from "lucide-react";

export function MobileFab({
  label,
  onClick,
  disabled,
  icon: Icon = Plus,
}: {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  icon?: LucideIcon;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="fixed right-4 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-on-primary hover:bg-primary-hover disabled:opacity-50 motion-reduce:transition-none lg:hidden bottom-[calc(4rem+var(--safe-area-bottom)+0.75rem)]"
    >
      <Icon className="size-6" strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
