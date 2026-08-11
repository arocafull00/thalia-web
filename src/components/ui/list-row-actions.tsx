"use client";

import ListRowActionButton from "@/components/ui/list-row-action-button";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import ProfileActionsMenu from "@/components/ui/profile/profile-actions-menu";

type ListRowActionsProps = {
  actions: ProfileAction[];
  label: string;
  variant?: "inline" | "menu";
};

export default function ListRowActions({
  actions,
  label,
  variant = "inline",
}: ListRowActionsProps) {
  if (actions.length === 0) {
    return null;
  }

  if (variant === "menu") {
    return (
      <div onClick={(event) => event.stopPropagation()}>
        <ProfileActionsMenu
          ariaLabel={label}
          sections={[{ label: "Acciones", actions }]}
        />
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-end gap-1"
      onClick={(event) => event.stopPropagation()}
    >
      {actions.map((action) => (
        <ListRowActionButton key={action.label} action={action} />
      ))}
    </div>
  );
}
