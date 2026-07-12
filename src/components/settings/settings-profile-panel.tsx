"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { ActionButton } from "@/components/ui/primitives/action-button";
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
  onEdit,
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
      <button
        type="button"
        disabled={uploadingAvatar}
        onClick={onPickAvatar}
        className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border/60 bg-primary-subtle/40 disabled:opacity-60"
      >
        {displayUri ? (
          <Image
            src={displayUri}
            alt=""
            width={80}
            height={80}
            unoptimized
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-sm text-ink-muted">Foto</span>
        )}
      </button>
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
      <ActionButton title="Editar perfil" variant="ghost" onClick={onEdit} />
    </div>
  );
}
