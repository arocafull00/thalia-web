"use client";

import { Mail, Pencil, Phone } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { buildProfileSubtitle } from "@/lib/hooks/use-settings-page";
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
  const profileSubtitle = buildProfileSubtitle(profile.specialty, profile.role);
  const initials = getProfileInitials(profile.full_name);

  return (
    <div className="flex flex-col items-center gap-3 px-4 py-6 text-center lg:gap-4 lg:px-6 lg:py-8">
      <button
        type="button"
        disabled={uploadPending}
        onClick={onPickAvatar}
        className="relative size-14 shrink-0 overflow-visible rounded-full disabled:opacity-60 lg:size-20"
      >
        <span className="flex size-14 items-center justify-center overflow-hidden rounded-full bg-primary-subtle text-primary ring-2 ring-border ring-offset-2 ring-offset-canvas lg:size-20">
          {displayUri ? (
            <Image
              src={displayUri}
              alt=""
              width={80}
              height={80}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <span className="text-xl font-semibold">{initials}</span>
          )}
        </span>
        <span className="absolute right-0 bottom-0 flex size-7 items-center justify-center rounded-full border-2 border-canvas bg-primary text-on-primary">
          <Pencil className="size-3.5" aria-hidden="true" />
        </span>
      </button>

      <div className="min-w-0 space-y-3">
        <h1 className="text-xl font-semibold text-ink text-wrap-balance">
          {profile.full_name}
        </h1>

        <p className="text-xs text-ink-muted">{profileSubtitle}</p>

        {isAdmin ? (
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="default">{SETTINGS_COPY.profile.adminBadge}</Badge>
          </div>
        ) : null}

        <div className="flex flex-col items-center gap-2">
          {profile.phone ? (
            <a
              href={`tel:${profile.phone}`}
              className="inline-flex items-center justify-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
            >
              <Phone
                className="size-4 shrink-0 text-ink-muted"
                aria-hidden="true"
              />
              <span>{profile.phone}</span>
            </a>
          ) : null}
          {userEmail ? (
            <a
              href={`mailto:${userEmail}`}
              className="inline-flex max-w-full items-center justify-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
            >
              <Mail
                className="size-4 shrink-0 text-ink-muted"
                aria-hidden="true"
              />
              <span className="truncate">{userEmail}</span>
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
