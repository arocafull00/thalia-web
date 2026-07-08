"use client";

import { Pencil } from "lucide-react";

import ProfileQuickActionButton from "@/components/ui/profile/profile-quick-action-button";
import { SETTINGS_COPY } from "@/copy/settings-copy";

type SettingsProfileQuickActionsProps = {
  onEdit: () => void;
};

export default function SettingsProfileQuickActions({
  onEdit,
}: SettingsProfileQuickActionsProps) {
  return (
    <div className="flex flex-row flex-wrap justify-center gap-2 px-4 py-4 lg:flex-col lg:gap-2 lg:px-6 lg:py-6">
      <ProfileQuickActionButton
        label={SETTINGS_COPY.profile.editProfile}
        icon={Pencil}
        onClick={onEdit}
      />
    </div>
  );
}
