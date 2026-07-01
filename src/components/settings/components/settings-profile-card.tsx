"use client";

import { ChevronRight, Mail, Pencil, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import SettingsStatItem from "@/components/settings/components/settings-stat-item";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { buildProfileSubtitle } from "@/lib/hooks/use-settings-page";
import type { Employee } from "@/types/database.types";

type SettingsProfileCardProps = {
  canViewClinicRequests: boolean;
  displayUri: string | null;
  isAdmin: boolean;
  onPickAvatar: () => void;
  pendingRequestsCount: number;
  profile: Employee;
  statItems: Array<{
    label: string;
    tone?: "default" | "success" | "warning";
    value: string;
  }>;
  uploadPending: boolean;
  userEmail: string | undefined;
};

export default function SettingsProfileCard({
  canViewClinicRequests,
  displayUri,
  isAdmin,
  onPickAvatar,
  pendingRequestsCount,
  profile,
  statItems,
  uploadPending,
  userEmail,
}: SettingsProfileCardProps) {
  const profileSubtitle = buildProfileSubtitle(profile.specialty, profile.role);
  const hasPendingRequests = pendingRequestsCount > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="border-b border-border-subtle bg-primary-subtle/35 px-6 py-8 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center">
          <button
            type="button"
            disabled={uploadPending}
            onClick={onPickAvatar}
            className="relative h-28 w-28 shrink-0 overflow-visible rounded-full disabled:opacity-60"
          >
            <span className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-2 border-surface bg-surface">
              {displayUri ? (
                <Image
                  src={displayUri}
                  alt=""
                  width={112}
                  height={112}
                  unoptimized
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-3xl font-semibold text-ink-secondary">
                  {profile.full_name?.charAt(0) ?? "?"}
                </span>
              )}
            </span>
            <span className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-surface bg-primary text-on-primary">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </button>

          <div className="min-w-0 flex-1 space-y-3">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-ink lg:text-3xl">
                {profile.full_name}
              </p>
              <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-ink-secondary">
                {profileSubtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isAdmin ? (
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium uppercase tracking-wide text-on-primary">
                  {SETTINGS_COPY.profile.adminBadge}
                </span>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-6">
              {profile.phone ? (
                <div className="flex items-center gap-2">
                  <Phone
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm font-medium text-ink-secondary">
                    {profile.phone}
                  </span>
                </div>
              ) : null}
              {userEmail ? (
                <div className="flex min-w-0 items-center gap-2">
                  <Mail
                    className="h-4 w-4 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="truncate text-sm font-medium text-ink-secondary">
                    {userEmail}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="shrink-0 lg:self-start">
            <ActionButton
              title={SETTINGS_COPY.profile.editProfile}
              onClick={() => globalThis.location.assign("/settings/edit")}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 py-6 lg:px-8">
        <div className="flex flex-col divide-y divide-border-subtle sm:flex-row sm:divide-x sm:divide-y-0">
          {statItems.map((item) => (
            <SettingsStatItem key={item.label} {...item} />
          ))}
        </div>

        {canViewClinicRequests ? (
          <Link
            href="/settings/clinic-requests"
            className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition-colors ${
              hasPendingRequests
                ? "border-warning/30 bg-warning-subtle text-ink hover:bg-warning-subtle/80"
                : "border-border-subtle text-ink-secondary hover:border-border hover:bg-canvas hover:text-ink"
            }`}
          >
            <span className="font-medium">
              {SETTINGS_COPY.stats.viewClinicRequests}
            </span>
            <span className="flex items-center gap-2">
              {hasPendingRequests ? (
                <span className="rounded-full bg-warning px-2 py-0.5 text-xs font-semibold tabular-nums text-on-primary">
                  {pendingRequestsCount}
                </span>
              ) : null}
              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </span>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
