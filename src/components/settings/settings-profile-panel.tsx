"use client";

import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { buildProfileSubtitle } from "@/lib/hooks/use-settings-page";
import { useSettingsUiStore } from "@/stores/settings-ui-store";
import { ActionButton } from "@/components/ui/primitives";

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
        className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 disabled:opacity-60"
      >
        {displayUri ? (
          <img src={displayUri} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-sm text-zinc-400">Foto</span>
        )}
      </button>
      <div>
        <p className="text-lg font-medium text-zinc-900">{profile.full_name}</p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-zinc-400">
          {buildProfileSubtitle(profile.specialty, profile.role)}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {isAdmin ? (
          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">Administrador de Clínica</span>
        ) : null}
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600">Suscripción Pro</span>
      </div>
      <ActionButton title="Editar perfil" variant="ghost" onClick={() => globalThis.location.assign("/settings/edit")} />
    </div>
  );
}
