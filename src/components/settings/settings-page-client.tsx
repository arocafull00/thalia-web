"use client";

import { useRef } from "react";

import PwaInstallPanel from "@/components/pwa/components/pwa-install-panel";
import SettingsAccountPanel from "@/components/settings/components/settings-account-panel";
import SettingsManagementPanel from "@/components/settings/components/settings-management-panel";
import SettingsProfileSidebar from "@/components/settings/components/settings-profile-sidebar";
import { Notice } from "@/components/ui/primitives/notice";
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
    activeEmployeesCount,
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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 px-4 pt-6 pb-4 lg:px-8">
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {SETTINGS_COPY.page.title}
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          {SETTINGS_COPY.page.subtitle}
        </p>
      </div>

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

      <div className="flex min-h-0 flex-1 flex-col lg:grid lg:grid-cols-[20%_1fr]">
        <div className="order-1 flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-6 lg:order-2 lg:px-6 lg:py-8">
          <div className="flex flex-col [&>section:not(:last-child)]:mb-8 [&>section:not(:last-child)]:border-b [&>section:not(:last-child)]:border-border-subtle [&>section:not(:last-child)]:pb-8">
            <SettingsAccountPanel
              onChangePassword={() => void handleChangePassword()}
              onSignOut={() => void handleSignOut()}
              passwordMessage={passwordMessage}
              passwordSubmitting={passwordSubmitting}
              signOutSubmitting={signOutSubmitting}
            />

            {isAdmin ? <SettingsManagementPanel /> : null}

            <PwaInstallPanel />
          </div>
        </div>

        <SettingsProfileSidebar
          activeEmployeesCount={activeEmployeesCount}
          canViewClinicRequests={canViewClinicRequests}
          displayUri={displayUri}
          isAdmin={isAdmin}
          onPickAvatar={() => fileInputRef.current?.click()}
          pendingRequestsCount={pendingClinicRequests.length}
          profile={profile}
          uploadPending={uploadAvatar.isPending}
          userEmail={user.email}
        />
      </div>
    </div>
  );
}
