"use client";

import PatientAvatarField from "@/components/patients/components/patient-avatar-field";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { buildProfileSubtitle } from "@/lib/hooks/use-settings-page";
import type { Employee } from "@/types/database.types";

type SettingsDetailHeaderProps = {
  profile: Employee;
  userEmail: string | undefined;
  avatarDisplayUri: string | null;
  avatarUploadPending: boolean;
  onAvatarFileSelected: (file: File) => void;
  onEdit: () => void;
};

export default function SettingsDetailHeader({
  profile,
  userEmail,
  avatarDisplayUri,
  avatarUploadPending,
  onAvatarFileSelected,
  onEdit,
}: SettingsDetailHeaderProps) {
  const initials = getProfileInitials(profile.full_name);
  const subtitleParts = [
    buildProfileSubtitle(profile.specialty, profile.role),
    profile.phone,
    userEmail,
  ].filter(Boolean);

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-6 pb-6 lg:px-8">
      <div className="flex items-center gap-4">
        <PatientAvatarField
          displayUri={avatarDisplayUri}
          initials={initials}
          uploadPending={avatarUploadPending}
          onFileSelected={onAvatarFileSelected}
        />

        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold text-ink">
            {profile.full_name}
          </h1>
          {subtitleParts.length > 0 ? (
            <p className="text-sm text-ink-secondary">
              {subtitleParts.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 lg:flex">
        <ActionButton
          title={SETTINGS_COPY.profile.editProfile}
          onClick={onEdit}
        />
      </div>
    </div>
  );
}
