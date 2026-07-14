"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { buildProfileSubtitle } from "@/lib/hooks/use-settings-page";
import { useSettingsUiStore } from "@/stores/settings-ui-store";

type SettingsProfilePanelProps = {
  uploadingAvatar: boolean;
  onEdit: () => void;
  onPickAvatar: () => void;
};

export default function SettingsProfilePanel({
  uploadingAvatar,
  onPickAvatar,
}: SettingsProfilePanelProps) {
  const { profile } = useAuth();
  const localAvatarUri = useSettingsUiStore((state) => state.localAvatarUri);
  const resolvedAvatarUrl = useFileUrl(profile?.avatar_url ?? null);
  const displayUri = localAvatarUri ?? resolvedAvatarUrl;
  const isAdmin = profile?.role === "admin";

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        disabled={uploadingAvatar}
        onClick={onPickAvatar}
        className="h-20 w-20 overflow-hidden rounded-full border border-border/60 bg-primary-subtle/40 p-0"
      >
        {displayUri ? (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full bg-primary-subtle">
            <Image
              src={displayUri}
              alt={`Avatar de ${profile.full_name}`}
              fill
              sizes="160px"
              quality={90}
              className="object-cover"
            />
          </div>
        ) : (
          <span className="text-sm text-ink-muted">Foto</span>
        )}
      </Button>
      <div>
        <p className="text-lg font-medium text-ink">{profile.full_name}</p>
        <p className="mt-1 text-xs text-ink-muted">
          {buildProfileSubtitle(profile.specialty, profile.role)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {isAdmin ? (
          <Badge variant="default">Administrador de Clínica</Badge>
        ) : null}
        <Badge variant="muted">Suscripción Pro</Badge>
      </div>
    </div>
  );
}
