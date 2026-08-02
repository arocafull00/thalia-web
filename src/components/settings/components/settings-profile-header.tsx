"use client";

import { Pencil } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileAvatarImage } from "@/components/ui/profile/profile-avatar-image";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { ProfileIdentitySummary } from "@/components/ui/profile/profile-identity-summary";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { employeeRoleLabel } from "@/lib/format";
import type { Employee } from "@/types/database.types";

type SettingsProfileHeaderProps = {
  displayUri: string | null;
  isAdmin: boolean;
  onPickAvatar: () => void;
  profile: Employee;
  uploadPending: boolean;
  userEmail: string | undefined;
};

export default function SettingsProfileHeader({
  displayUri,
  isAdmin,
  onPickAvatar,
  profile,
  uploadPending,
  userEmail,
}: SettingsProfileHeaderProps) {
  const initials = getProfileInitials(profile.full_name);

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6 text-center lg:gap-4 lg:px-6 lg:py-8">
      <Button
        type="button"
        variant="ghost"
        disabled={uploadPending}
        onClick={onPickAvatar}
        className="relative shrink-0 overflow-visible rounded-full p-0"
      >
        <div className="rounded-full bg-surface p-0.5 ring-1 ring-border-subtle">
          <ProfileAvatarImage
            src={displayUri}
            initials={initials}
            size="lg"
            fallbackClassName="bg-primary-subtle text-primary"
          />
        </div>
        <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-primary text-on-primary">
          <Pencil className="size-3.5" aria-hidden="true" />
        </span>
      </Button>

      <ProfileIdentitySummary
        centered
        name={profile.full_name}
        specialty={profile.specialty}
        phone={profile.phone}
        email={userEmail}
        badges={
          <>
            <Badge variant="purple">{employeeRoleLabel(profile.role)}</Badge>
            {isAdmin ? (
              <Badge variant="default">
                {SETTINGS_COPY.profile.adminBadge}
              </Badge>
            ) : null}
          </>
        }
      />
    </div>
  );
}
