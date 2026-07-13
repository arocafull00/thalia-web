"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

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
  if (variant === "ghost") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onClick}
        className="text-ink-secondary"
      >
        {Icon ? (
          <Icon className="size-3.5 shrink-0" aria-hidden="true" />
        ) : null}
        {title}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      size="sm"
      disabled={disabled}
      onClick={onClick}
      data-cuelume-press=""
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
      {title}
    </Button>
  );
}
