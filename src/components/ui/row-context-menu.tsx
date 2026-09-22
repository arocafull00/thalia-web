"use client";

import type { ReactElement } from "react";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import ProfileActionContextMenuItem from "@/components/ui/profile/profile-action-context-menu-item";

type RowContextMenuProps = {
  actions: ProfileAction[];
  children: ReactElement;
};

export default function RowContextMenu({
  actions,
  children,
}: RowContextMenuProps) {
  if (actions.length === 0) {
    return children;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {actions.map((action) => (
          <ProfileActionContextMenuItem key={action.label} action={action} />
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}
