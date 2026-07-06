"use client";

import type { LucideIcon } from "lucide-react";

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
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={`flex min-h-11 min-w-11 items-center justify-center rounded-full lg:hidden motion-reduce:transition-none ${
          variant === "solid"
            ? "bg-primary text-on-primary hover:bg-primary-hover"
            : "border border-border text-ink-secondary hover:bg-canvas"
        }`}
      >
        <Icon size={18} aria-hidden="true" />
      </button>
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
