"use client";

import PatientAvatarField from "@/components/patients/components/shared/patient-avatar-field";
import { Badge } from "@/components/ui/badge";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { ProfileIdentitySummary } from "@/components/ui/profile/profile-identity-summary";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { employeeRoleLabel } from "@/lib/format";
import type { Employee } from "@/types/database.types";

type SettingsDetailHeaderProps = {
  profile: Employee;
  userEmail: string | undefined;
  avatarDisplayUri: string | null;
  avatarUploadPending: boolean;
  onAvatarFileSelected: (file: File) => void;
};

export default function SettingsDetailHeader({
  profile,
  userEmail,
  avatarDisplayUri,
  avatarUploadPending,
  onAvatarFileSelected,
}: SettingsDetailHeaderProps) {
  const initials = getProfileInitials(profile.full_name);
  const isAdmin = profile.role === "admin";

  return (
    <header className="shrink-0 border-b border-border-subtle bg-surface">
      <div className="flex flex-col gap-5 px-4 py-6 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex min-w-0 items-center gap-4">
          <PatientAvatarField
            displayUri={avatarDisplayUri}
            initials={initials}
            uploadPending={avatarUploadPending}
            onFileSelected={onAvatarFileSelected}
          />

          <ProfileIdentitySummary
            name={profile.full_name}
            specialty={profile.specialty}
            phone={profile.phone}
            email={userEmail}
            badges={
              <>
                <Badge variant="purple">
                  {employeeRoleLabel(profile.role)}
                </Badge>
                {isAdmin ? (
                  <Badge variant="default">
                    {SETTINGS_COPY.profile.adminBadge}
                  </Badge>
                ) : null}
              </>
            }
          />
        </div>
      </div>
    </header>
  );
}
