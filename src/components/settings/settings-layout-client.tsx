"use client";

import { Clock, Pencil } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ClinicEditDialog from "@/components/settings/components/clinic-edit-dialog";
import ClinicHoursDialog from "@/components/settings/components/clinic-hours-dialog";
import ProfileEditDialog from "@/components/settings/components/profile-edit-dialog";
import SettingsNav from "@/components/settings/components/settings-nav";
import SettingsSectionContent from "@/components/settings/components/settings-section-content";
import { getSettingsDetailPrimaryAction } from "@/components/settings/settings-detail-actions";
import { Notice } from "@/components/ui/primitives/notice";
import { CLINIC_EDIT_COPY } from "@/copy/clinic-edit-copy";
import { CLINIC_HOURS_COPY } from "@/copy/clinic-hours-copy";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useAuth } from "@/lib/hooks/use-auth";
import { useClinicInfo, type ClinicInfo } from "@/lib/hooks/use-clinic-info";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { useSettingsPageActions } from "@/lib/hooks/use-settings-page";
import { useTopbarActions } from "@/lib/hooks/use-topbar-actions";
import { getSettingsSectionFromPathname } from "@/lib/settings-sections";
import { useSettingsUiStore } from "@/stores/settings-ui-store";
import type { Employee } from "@/types/database.types";

type SettingsLayoutClientProps = {
  children: React.ReactNode;
  initialClinic?: ClinicInfo | null;
  initialEmployees?: Employee[];
};

export default function SettingsLayoutClient({
  children,
  initialClinic = null,
  initialEmployees,
}: SettingsLayoutClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeSection = getSettingsSectionFromPathname(pathname);
  const { profile, user } = useAuth();
  const localAvatarUri = useSettingsUiStore((state) => state.localAvatarUri);
  const resolvedAvatarUrl = useFileUrl(profile?.avatar_url ?? null);
  const displayUri = localAvatarUri ?? resolvedAvatarUrl;
  const {
    activeEmployeesCount,
    handleAvatarPress,
    handleChangePassword,
    handleSignOut,
    canManageClinic,
    passwordMessage,
    passwordSubmitting,
    signOutSubmitting,
    uploadAvatar,
  } = useSettingsPageActions(initialEmployees);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [clinicEditDialogOpen, setClinicEditDialogOpen] = useState(false);
  const [hoursDialogOpen, setHoursDialogOpen] = useState(false);
  const {
    clinic,
    loading: clinicLoading,
    refetch: refetchClinic,
  } = useClinicInfo(initialClinic);

  useEffect(() => {
    if (activeSection !== "clinica" || canManageClinic) {
      return;
    }

    router.replace("/settings/usuario");
  }, [activeSection, canManageClinic, router]);

  useTopbarActions(
    profile && activeSection
      ? activeSection === "clinica"
        ? {
            buttons: [
              {
                title: CLINIC_EDIT_COPY.title,
                icon: Pencil,
                onClick: () => setClinicEditDialogOpen(true),
                variant: "solid" as const,
              },
            ],
            menu: {
              sections: [
                {
                  label: SETTINGS_COPY.menuSections.clinic,
                  actions: [
                    {
                      label: CLINIC_HOURS_COPY.title,
                      icon: Clock,
                      onClick: () => setHoursDialogOpen(true),
                    },
                  ],
                },
              ],
              ariaLabel: SETTINGS_COPY.moreActions,
            },
          }
        : activeSection === "usuario"
          ? {
              buttons: [
                getSettingsDetailPrimaryAction({
                  onEdit: () => setEditDialogOpen(true),
                }),
              ],
              menu: {
                sections: [],
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

  if (!activeSection) {
    return null;
  }

  if (activeSection === "clinica" && !canManageClinic) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto lg:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col">
        <SettingsNav
          activeSection={activeSection}
          canManageClinic={canManageClinic}
        />
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8 pt-6 lg:px-8">
          <SettingsSectionContent
            section={activeSection}
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
          {children}
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
