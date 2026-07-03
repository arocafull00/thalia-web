"use client";

import { Pencil } from "lucide-react";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { SETTINGS_COPY } from "@/copy/settings-copy";

export default function SettingsProfileQuickActions() {
  return (
    <div className="flex flex-col gap-2 px-6 py-6">
      <div className="w-full [&>button]:w-full">
        <ActionButton
          title={SETTINGS_COPY.profile.editProfile}
          icon={Pencil}
          onClick={() => globalThis.location.assign("/settings/edit")}
        />
      </div>
    </div>
  );
}
