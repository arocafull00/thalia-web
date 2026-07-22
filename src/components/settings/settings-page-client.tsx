"use client";

import { Clock, Pencil } from "lucide-react";
import { useState } from "react";

import ClinicEditDialog from "@/components/settings/components/clinic-edit-dialog";
import ClinicHoursDialog from "@/components/settings/components/clinic-hours-dialog";
import ProfileEditDialog from "@/components/settings/components/profile-edit-dialog";
import SettingsDetailTabBar from "@/components/settings/components/settings-detail-tab-bar";
import SettingsDetailTabContent from "@/components/settings/components/settings-detail-tab-content";
import { getSettingsDetailActions } from "@/components/settings/settings-detail-actions";
import { Notice } from "@/components/ui/primitives/notice";
import { CLINIC_EDIT_COPY } from "@/copy/clinic-edit-copy";
import { CLINIC_HOURS_COPY } from "@/copy/clinic-hours-copy";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useAuth } from "@/lib/hooks/use-auth";
import { useClinicInfo } from "@/lib/hooks/use-clinic-info";
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
    handleAvatarPress,
    handleChangePassword,
    handleSignOut,
    isAdmin,
    passwordMessage,
    passwordSubmitting,
    signOutSubmitting,
    uploadAvatar,
  } = useSettingsPageActions();
  const { activeTab, setActiveTab } = useSettingsTabs();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [clinicEditDialogOpen, setClinicEditDialogOpen] = useState(false);
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false);
  const {
    clinic,
    loading: clinicLoading,
    refetch: refetchClinic,
  } = useClinicInfo();

  useTopbarActions(
    profile
      ? activeTab === "clinica"
        ? {
            buttons: [
              {
                title: CLINIC_EDIT_COPY.title,
                icon: Pencil,
                onClick: () => setClinicEditDialogOpen(true),
                variant: "solid" as const,
              },
              {
                title: CLINIC_HOURS_COPY.title,
                icon: Clock,
                onClick: () => setHoursDialogOpen(true),
                variant: "ghost" as const,
              },
            ],
            menu: { actions: [], ariaLabel: SETTINGS_COPY.moreActions },
          }
        : activeTab === "usuario"
          ? {
              buttons: [],
              menu: {
                actions: getSettingsDetailActions(profile, user?.email, {
                  onEdit: () => setEditDialogOpen(true),
                }),
                ariaLabel: SETTINGS_COPY.moreActions,
              },
            }
          : null
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
      <div className="flex flex-col gap-6 px-4 pb-8 pt-6 lg:px-8">
        <SettingsDetailTabBar
          activeTab={activeTab}
          isAdmin={isAdmin}
          onTabChange={setActiveTab}
        />
        <div role="tabpanel">
          <SettingsDetailTabContent
            activeTab={activeTab}
            profile={profile}
            userEmail={user.email}
            avatarDisplayUri={displayUri}
            avatarUploadPending={uploadAvatar.isPending}
            onAvatarFileSelected={(file) => void handleAvatarPress(file)}
            activeEmployeesCount={activeEmployeesCount}
            onChangePassword={() => void handleChangePassword()}
            onSignOut={() => void handleSignOut()}
            passwordMessage={passwordMessage}
            passwordSubmitting={passwordSubmitting}
            signOutSubmitting={signOutSubmitting}
            clinic={clinic}
            clinicLoading={clinicLoading}
          />
        </div>
      </div>

      <ProfileEditDialog
        profile={profile}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => {}}
      />

      <ClinicEditDialog
        clinic={clinic}
        open={clinicEditDialogOpen}
        onOpenChange={setClinicEditDialogOpen}
        onSuccess={refetchClinic}
      />

      <ClinicHoursDialog
        clinic={clinic}
        open={hoursDialogOpen}
        onOpenChange={setHoursDialogOpen}
        onSuccess={refetchClinic}
      />
    </div>
  );
}
