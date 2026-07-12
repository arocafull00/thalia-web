"use client";

import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";

type ProfileQuickActionButtonProps = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  variant?: "solid" | "ghost";
};

export default function ProfileQuickActionButton({
  label,
  icon: Icon,
  onClick,
  variant = "solid",
}: ProfileQuickActionButtonProps) {
  return (
    <>
      <Button
        type="button"
        variant={variant === "solid" ? "default" : "outline"}
        size="icon"
        aria-label={label}
        onClick={onClick}
        className="min-h-11 min-w-11 rounded-full lg:hidden motion-reduce:transition-none"
      >
        <Icon size={18} aria-hidden="true" />
      </Button>
      <div className="hidden w-full lg:block [&>button]:w-full">
        <ActionButton
          title={label}
          icon={Icon}
          variant={variant}
          onClick={onClick}
        />
      </div>
    </>
  );
}
