"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ActionButton({
  title,
  icon: Icon,
  onClick,
  disabled,
  variant = "solid",
  testId,
  className,
}: {
  title: string;
  icon?: LucideIcon;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
  testId?: string;
  className?: string;
}) {
  if (variant === "ghost") {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled}
        onClick={onClick}
        data-testid={testId}
        className={cn("text-ink-secondary", className)}
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
      data-testid={testId}
      data-cuelume-press=""
      className={className}
    >
      {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
      {title}
    </Button>
  );
}
