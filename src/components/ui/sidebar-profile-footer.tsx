"use client";

import { LogOut, Users } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { SIDEBAR_COPY } from "@/copy/sidebar-copy";
import { employeeRoleLabel } from "@/lib/format";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";

export default function SidebarProfileFooter() {
  const { profile, signOut } = useAuth();
  const avatarUrl = useFileUrl(profile?.avatar_url ?? null);

  return (
    <div className="flex items-center gap-3 px-6 py-5">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-subtle/40">
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt=""
            width={40}
            height={40}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <Users size={16} className="text-ink-muted" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p
          className="truncate text-sm font-medium text-ink"
          title={profile?.full_name ?? undefined}
        >
          {profile?.full_name ?? SIDEBAR_COPY.profileFallback}
        </p>
        {profile?.role ? (
          <p className="truncate text-xs text-ink-muted">
            {employeeRoleLabel(profile.role)}
          </p>
        ) : null}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label={SIDEBAR_COPY.signOut}
        onClick={() => void signOut()}
        className="shrink-0 rounded-lg text-ink-muted hover:text-ink"
      >
        <LogOut size={16} />
      </Button>
    </div>
  );
}
