import { Mail, Pencil, Phone } from "lucide-react";

import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import type { Employee } from "@/types/database.types";

type SettingsDetailActionHandlers = {
  onEdit: () => void;
};

export function getSettingsDetailActions(
  profile: Employee,
  userEmail: string | undefined,
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

  if (profile.phone) {
    actions.push({
      label: SETTINGS_COPY.actions.call,
      icon: Phone,
      href: `tel:${profile.phone}`,
      buttonVariant: "ghost",
    });
  }

  if (userEmail) {
    actions.push({
      label: SETTINGS_COPY.actions.email,
      icon: Mail,
      href: `mailto:${userEmail}`,
      buttonVariant: "ghost",
    });
  }

  return actions;
}
