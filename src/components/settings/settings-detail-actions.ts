import { Pencil } from "lucide-react";

import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import type { Employee } from "@/types/database.types";

type SettingsDetailActionHandlers = {
  onEdit: () => void;
};

export function getSettingsDetailActions(
  _profile: Employee,
  _userEmail: string | undefined,
  handlers: SettingsDetailActionHandlers,
): ProfileAction[] {
  const actions: ProfileAction[] = [
    {
      label: SETTINGS_COPY.profile.editProfile,
      icon: Pencil,
      onClick: handlers.onEdit,
      buttonVariant: "solid",
    },
  ];

  return actions;
}
