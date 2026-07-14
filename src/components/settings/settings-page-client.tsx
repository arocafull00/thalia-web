"use client";

import { useState } from "react";

import ProfileEditDialog from "@/components/settings/components/profile-edit-dialog";
import SettingsDetailHeader from "@/components/settings/components/settings-detail-header";
import SettingsDetailTabBar from "@/components/settings/components/settings-detail-tab-bar";
import SettingsDetailTabContent from "@/components/settings/components/settings-detail-tab-content";
import { getSettingsDetailActions } from "@/components/settings/settings-detail-actions";
import { Notice } from "@/components/ui/primitives/notice";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { useSettingsPageActions } from "@/lib/hooks/use-settings-page";
import { useSettingsTabs } from "@/lib/hooks/use-settings-tabs";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
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
  const { activeTab, setActiveTab } = useSettingsTabs();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useTopbarActions(
    profile
      ? {
          buttons: [],
          menu: {
            actions: getSettingsDetailActions(profile, user?.email, {
              onEdit: () => setEditDialogOpen(true),
            }),
            ariaLabel: SETTINGS_COPY.moreActions,
          },
        }
      : null,
  );

  if (!profile || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-8">
        <Notice tone="danger" message={SETTINGS_COPY.page.profileError} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <SettingsDetailHeader
        profile={profile}
        userEmail={user.email}
        avatarDisplayUri={displayUri}
        avatarUploadPending={uploadAvatar.isPending}
        onAvatarFileSelected={(file) => void handleAvatarPress(file)}
      />

      <div className="flex flex-col gap-6 px-4 pb-8 lg:px-8">
        <SettingsDetailTabBar
          activeTab={activeTab}
          isAdmin={isAdmin}
          onTabChange={setActiveTab}
        />
        <div role="tabpanel">
          <SettingsDetailTabContent
            activeTab={activeTab}
            activeEmployeesCount={activeEmployeesCount}
            canViewClinicRequests={canViewClinicRequests}
            isAdmin={isAdmin}
            onChangePassword={() => void handleChangePassword()}
            onSignOut={() => void handleSignOut()}
            passwordMessage={passwordMessage}
            passwordSubmitting={passwordSubmitting}
            pendingRequestsCount={pendingClinicRequests.length}
            signOutSubmitting={signOutSubmitting}
          />
        </div>
      </div>

      <ProfileEditDialog
        profile={profile}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {}}
      />
    </div>
  );
}
