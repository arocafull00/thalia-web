"use client";

import { LogOut } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ProfileAvatarImage } from "@/components/ui/profile/profile-avatar-image";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import SidebarSignOutConfirmDialog from "@/components/ui/sidebar-sign-out-confirm-dialog";
import { SIDEBAR_COPY } from "@/copy/sidebar-copy";
import { employeeRoleLabel } from "@/lib/format";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { resolveAvatarDisplayUri } from "@/lib/storage";

export default function SidebarProfileFooter() {
  const { profile } = useAuth();
  const resolvedAvatarUrl = useFileUrl(profile?.avatar_url ?? null);
  const displayUri = resolveAvatarDisplayUri(
    resolvedAvatarUrl,
    profile?.updated_at,
  );
  const [signOutOpen, setSignOutOpen] = useState(false);
  const initials = profile?.full_name
    ? getProfileInitials(profile.full_name)
    : "?";

  return (
    <>
      <div className="flex items-center gap-2.5 px-1.5 py-3.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0">
        <ProfileAvatarImage
          src={displayUri}
          initials={initials}
          size="sm"
          avatarStyle={{ borderRadius: "var(--radius-button)" }}
          fallbackClassName="bg-[image:var(--gradient-avatar)] text-[12.5px] font-semibold text-primary-hover"
        />
        <div className="min-w-0 flex-1 overflow-hidden transition-[opacity,width] duration-[var(--sidebar-duration)] ease-[var(--sidebar-ease)] group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:opacity-0">
          <p
            className="truncate text-[13.5px] font-medium text-ink"
            title={profile?.full_name ?? undefined}
          >
            {profile?.full_name ?? SIDEBAR_COPY.profileFallback}
          </p>
          {profile?.role ? (
            <p className="truncate text-[11px] text-ink-muted">
              {employeeRoleLabel(profile.role)}
            </p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={SIDEBAR_COPY.signOut}
          onClick={() => setSignOutOpen(true)}
          className="shrink-0 rounded-lg text-ink-muted transition-[opacity,width] duration-[var(--sidebar-duration)] ease-[var(--sidebar-ease)] hover:text-ink group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:opacity-0"
        >
          <LogOut size={16} />
        </Button>
      </div>
      <SidebarSignOutConfirmDialog
        open={signOutOpen}
        onOpenChange={setSignOutOpen}
      />
    </>
  );
}
