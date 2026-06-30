"use client";

import { LogOut, Users } from "lucide-react";

import SidebarClinicSwitcher from "@/components/ui/sidebar-clinic-switcher";
import { SIDEBAR_COPY } from "@/components/ui/sidebar-copy";
import { clinicMembershipRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";

export default function SidebarProfileFooter() {
  const { profile, signOut } = useAuth();
  const avatarUrl = useFileUrl(profile?.avatar_url ?? null);
  const { clinicName, platformRole, memberships, membership, setActiveClinic } = useActiveClinic();

  const membershipRoleLabel = platformRole ? clinicMembershipRoleLabel(platformRole) : null;

  return (
    <div className="mt-auto rounded-2xl border border-border bg-surface p-3">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-subtle/40">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Users size={16} className="text-ink-muted" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink" title={profile?.full_name ?? undefined}>
            {profile?.full_name ?? SIDEBAR_COPY.profileFallback}
          </p>
          {membershipRoleLabel ? (
            <p className="truncate text-xs text-ink-secondary">{membershipRoleLabel}</p>
          ) : null}
          {clinicName ? (
            <SidebarClinicSwitcher
              clinicName={clinicName}
              memberships={memberships}
              activeClinicId={membership?.clinicId ?? null}
              onSelectClinic={setActiveClinic}
            />
          ) : null}
        </div>
        <button
          type="button"
          aria-label={SIDEBAR_COPY.signOut}
          onClick={() => void signOut()}
          className="shrink-0 rounded-lg p-1.5 text-ink-muted hover:text-ink"
        >
          <LogOut size={16} />
        </button>
      </div>
    </div>
  );
}
