"use client";

import { Plus, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <Button
      type="button"
      size="icon-lg"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      className="fixed right-4 z-40 size-14 rounded-full bottom-[calc(4rem+var(--safe-area-bottom)+0.75rem)] motion-reduce:transition-none"
    >
      <Icon className="size-6" strokeWidth={2} aria-hidden="true" />
    </Button>
  );
}
