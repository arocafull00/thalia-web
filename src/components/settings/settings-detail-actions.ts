import { Pencil } from "lucide-react";

import type { ProfileActionSection } from "@/components/ui/profile/profile-action";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import type { TopbarActionButtonConfig } from "@/lib/hooks/use-topbar-actions";
import type { Employee } from "@/types/database.types";

type SettingsDetailActionHandlers = {
  onEdit: () => void;
};

export function getSettingsDetailPrimaryAction(
  handlers: SettingsDetailActionHandlers,
): TopbarActionButtonConfig {
  return {
    title: SETTINGS_COPY.profile.editProfile,
    icon: Pencil,
    onClick: handlers.onEdit,
  };
}

export function getSettingsDetailMenuSections(
  _profile: Employee,
  _userEmail: string | undefined,
  _handlers: SettingsDetailActionHandlers,
): ProfileActionSection[] {
  return [];
}
