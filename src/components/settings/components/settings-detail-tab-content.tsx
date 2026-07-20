import PwaInstallPanel from "@/components/pwa/components/pwa-install-panel";
import SettingsClinicPanel from "@/components/settings/components/settings-clinic-panel";
import SettingsUserPanel from "@/components/settings/components/settings-user-panel";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import type { SettingsTabId } from "@/lib/hooks/use-settings-tabs";
import type { Employee } from "@/types/database.types";

type SettingsDetailTabContentProps = {
  activeTab: SettingsTabId;
  profile: Employee;
  userEmail: string | undefined;
  avatarDisplayUri: string | null;
  avatarUploadPending: boolean;
  onAvatarFileSelected: (file: File) => void;
  activeEmployeesCount: number;
  onChangePassword: () => void;
  onSignOut: () => void;
  passwordMessage: string | null;
  passwordSubmitting: boolean;
  signOutSubmitting: boolean;
  clinic: ClinicInfo | null;
  clinicLoading: boolean;
};

export default function SettingsDetailTabContent({
  activeTab,
  profile,
  userEmail,
  avatarDisplayUri,
  avatarUploadPending,
  onAvatarFileSelected,
  activeEmployeesCount,
  onChangePassword,
  onSignOut,
  passwordMessage,
  passwordSubmitting,
  signOutSubmitting,
  clinic,
  clinicLoading,
}: SettingsDetailTabContentProps) {
  if (activeTab === "usuario") {
    return (
      <SettingsUserPanel
        profile={profile}
        userEmail={userEmail}
        avatarDisplayUri={avatarDisplayUri}
        avatarUploadPending={avatarUploadPending}
        onAvatarFileSelected={onAvatarFileSelected}
        onChangePassword={onChangePassword}
        onSignOut={onSignOut}
        passwordMessage={passwordMessage}
        passwordSubmitting={passwordSubmitting}
        signOutSubmitting={signOutSubmitting}
      />
    );
  }

  if (activeTab === "clinica") {
    return (
      <SettingsClinicPanel
        clinic={clinic}
        loading={clinicLoading}
        activeEmployeesCount={activeEmployeesCount}
      />
    );
  }

  return <PwaInstallPanel />;
}
