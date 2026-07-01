"use client";

import { useRef } from "react";

import PwaInstallPanel from "@/components/pwa/components/pwa-install-panel";
import SettingsAccountPanel from "@/components/settings/components/settings-account-panel";
import SettingsManagementPanel from "@/components/settings/components/settings-management-panel";
import SettingsProfileCard from "@/components/settings/components/settings-profile-card";
import { Notice } from "@/components/ui/primitives/notice";
import { PageHeader } from "@/components/ui/primitives/page-header";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { useSettingsPageActions } from "@/lib/hooks/use-settings-page";
import { useSettingsUiStore } from "@/stores/settings-ui-store";

export default function SettingsPageClient() {
  const { profile, user } = useAuth();
  const localAvatarUri = useSettingsUiStore((state) => state.localAvatarUri);
  const resolvedAvatarUrl = useFileUrl(profile?.avatar_url ?? null);
  const displayUri = localAvatarUri ?? resolvedAvatarUrl;
  const {
    canViewClinicRequests,
    handleAvatarPress,
    handleChangePassword,
    handleSignOut,
    isAdmin,
    passwordMessage,
    passwordSubmitting,
    pendingClinicRequests,
    signOutSubmitting,
    uploadAvatar,
  } = useSettingsPageActions();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!profile || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <Notice tone="danger" message={SETTINGS_COPY.page.profileError} />
      </div>
    );
  }

  const statItems = [
    ...(canViewClinicRequests
      ? [
          {
            label: SETTINGS_COPY.stats.pendingRequests,
            tone:
              pendingClinicRequests.length > 0
                ? ("warning" as const)
                : ("default" as const),
            value: String(pendingClinicRequests.length),
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        subtitle={SETTINGS_COPY.page.subtitle}
        title={SETTINGS_COPY.page.title}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (!file) return;
          handleAvatarPress(URL.createObjectURL(file));
        }}
      />

      <SettingsProfileCard
        canViewClinicRequests={canViewClinicRequests}
        displayUri={displayUri}
        isAdmin={isAdmin}
        onPickAvatar={() => fileInputRef.current?.click()}
        pendingRequestsCount={pendingClinicRequests.length}
        profile={profile}
        statItems={statItems}
        uploadPending={uploadAvatar.isPending}
        userEmail={user.email}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <SettingsAccountPanel
          onChangePassword={() => void handleChangePassword()}
          onSignOut={() => void handleSignOut()}
          passwordMessage={passwordMessage}
          passwordSubmitting={passwordSubmitting}
          signOutSubmitting={signOutSubmitting}
        />

        {isAdmin ? <SettingsManagementPanel /> : null}
      </div>

      <PwaInstallPanel />
    </div>
  );
}
