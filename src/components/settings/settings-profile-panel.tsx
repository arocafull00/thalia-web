"use client";

import Image from "next/image";

import { ActionButton } from "@/components/ui/primitives/action-button";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { buildProfileSubtitle } from "@/lib/hooks/use-settings-page";
import { useSettingsUiStore } from "@/stores/settings-ui-store";

type SettingsProfilePanelProps = {
  uploadingAvatar: boolean;
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
    <div className="space-y-5">
      <button
        type="button"
        disabled={uploadingAvatar}
        onClick={onPickAvatar}
        className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-border bg-primary-subtle/40 disabled:opacity-60"
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
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-ink-muted">
          {buildProfileSubtitle(profile.specialty, profile.role)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {isAdmin ? (
          <span className="rounded-full bg-primary-subtle/40 px-3 py-1 text-xs text-ink-secondary">
            Administrador de Clínica
          </span>
        ) : null}
        <span className="rounded-full bg-primary-subtle/40 px-3 py-1 text-xs text-ink-secondary">
          Suscripción Pro
        </span>
      </div>
      <ActionButton
        title="Editar perfil"
        variant="ghost"
        onClick={() => globalThis.location.assign("/settings/edit")}
      />
    </div>
  );
}
