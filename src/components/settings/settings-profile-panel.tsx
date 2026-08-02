"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProfileAvatarImage } from "@/components/ui/profile/profile-avatar-image";
import { getProfileInitials } from "@/components/ui/profile/profile-header";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { resolveAvatarDisplayUri } from "@/lib/storage";
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
  const displayUri = resolveAvatarDisplayUri(
    resolvedAvatarUrl,
    profile?.updated_at,
    localAvatarUri,
  );
  const isAdmin = profile?.role === "admin";

  if (!profile) {
    return null;
  }

  const initials = getProfileInitials(profile.full_name);

  return (
    <div className="space-y-6">
      <Button
        type="button"
        variant="ghost"
        disabled={uploadingAvatar}
        onClick={onPickAvatar}
        className="overflow-visible rounded-full p-0"
      >
        <div className="rounded-full bg-surface p-0.5 ring-1 ring-border-subtle">
          <ProfileAvatarImage
            src={displayUri}
            initials={initials}
            size="lg"
            fallbackClassName="bg-primary-subtle text-primary"
          />
        </div>
      </Button>
      <div>
        <p className="text-lg font-medium text-ink">{profile.full_name}</p>
        {profile.specialty ? (
          <p className="mt-1 text-sm text-ink-secondary">{profile.specialty}</p>
        ) : null}
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
