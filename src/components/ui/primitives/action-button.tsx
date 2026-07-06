"use client";

import type { LucideIcon } from "lucide-react";

export function ActionButton({
  title,
  icon: Icon,
  onClick,
  disabled,
  variant = "solid",
}: {
  title: string;
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  const content = (
    <>
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
      {title}
    </>
  );

  if (variant === "ghost") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-medium uppercase tracking-wide text-ink-secondary hover:bg-canvas disabled:opacity-50 motion-reduce:transition-none"
      >
        {content}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wide text-on-primary hover:bg-primary-hover disabled:opacity-50 motion-reduce:transition-none"
    >
      {content}
    </button>
  );
}
