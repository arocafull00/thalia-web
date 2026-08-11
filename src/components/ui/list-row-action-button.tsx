"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { ProfileAction } from "@/components/ui/profile/profile-action";

type ListRowActionButtonProps = {
  action: ProfileAction;
};

export default function ListRowActionButton({
  action,
}: ListRowActionButtonProps) {
  const Icon = action.icon;
  const variant = action.variant === "danger" ? "destructive" : "ghost";

  if (action.href) {
    return (
      <Button
        asChild
        variant={variant}
        size="icon-sm"
        title={action.label}
        aria-label={action.label}
      >
        <Link href={action.href}>
          <Icon aria-hidden="true" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant={variant}
      size="icon-sm"
      title={action.label}
      aria-label={action.label}
      disabled={action.disabled}
      data-testid={action.testId}
      onClick={action.onClick}
    >
      <Icon aria-hidden="true" />
    </Button>
  );
}
