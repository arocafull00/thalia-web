"use client";

import * as Popover from "@radix-ui/react-popover";
import { MoreVertical } from "lucide-react";
import { useState } from "react";

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
        <button
          type="button"
          aria-label={ariaLabel}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-ink-secondary hover:bg-canvas ${className ?? ""}`}
        >
          <MoreVertical className="size-4" aria-hidden="true" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="end"
          sideOffset={8}
          className="z-100 min-w-52 rounded-2xl border border-border bg-surface p-2 shadow-lg"
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
              <button
                key={action.label}
                type="button"
                onClick={() => {
                  closeMenu();
                  action.onClick?.();
                }}
                className={`${itemClassName} text-left`}
              >
                <Icon className="size-4 text-ink-muted" aria-hidden="true" />
                {action.label}
              </button>
            );
          })}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
