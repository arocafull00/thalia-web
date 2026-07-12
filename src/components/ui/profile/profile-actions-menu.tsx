"use client";

import * as Popover from "@radix-ui/react-popover";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { ProfileAction } from "@/components/ui/profile/profile-action";

type ProfileActionsMenuProps = {
  actions: ProfileAction[];
  ariaLabel: string;
  className?: string;
};

export default function ProfileActionsMenu({
  actions,
  ariaLabel,
  className,
}: ProfileActionsMenuProps) {
  const [open, setOpen] = useState(false);

  if (actions.length === 0) {
    return null;
  }

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={ariaLabel}
          className={`rounded-full ${className ?? ""}`}
        >
          <MoreVertical className="size-4" aria-hidden="true" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-100 min-w-52 rounded-[14px] border border-border/60 bg-surface p-1.5 shadow-float"
        >
          {actions.map((action) => {
            const Icon = action.icon;
            const itemClassName = `flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm ${
              action.variant === "danger"
                ? "text-danger hover:bg-danger-subtle"
                : "text-ink hover:bg-canvas"
            }`;

            if (action.href) {
              return (
                <a
                  key={action.label}
                  href={action.href}
                  onClick={closeMenu}
                  className={itemClassName}
                >
                  <Icon className="size-4 text-ink-muted" aria-hidden="true" />
                  {action.label}
                </a>
              );
            }

            return (
              <Button
                key={action.label}
                type="button"
                variant="ghost"
                onClick={() => {
                  closeMenu();
                  action.onClick?.();
                }}
                className={`h-auto justify-start ${itemClassName} text-left`}
              >
                <Icon className="size-4 text-ink-muted" aria-hidden="true" />
                {action.label}
              </Button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
