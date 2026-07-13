"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { cn } from "@/lib/utils";

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
  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={ariaLabel}
          className={cn(className)}
        >
          <MoreHorizontal size={18} strokeWidth={1.5} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => {
          const Icon = action.icon;
          const variant =
            action.variant === "danger" ? "destructive" : "default";

          if (action.href) {
            return (
              <DropdownMenuItem key={action.label} variant={variant} asChild>
                <a href={action.href}>
                  <Icon aria-hidden="true" />
                  {action.label}
                </a>
              </DropdownMenuItem>
            );
          }

          return (
            <DropdownMenuItem
              key={action.label}
              variant={variant}
              onClick={action.onClick}
            >
              <Icon aria-hidden="true" />
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
