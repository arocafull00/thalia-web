import SettingsClinicPanel from "@/components/settings/components/settings-clinic-panel";
import SettingsUserPanel from "@/components/settings/components/settings-user-panel";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import type { SettingsSectionId } from "@/lib/settings-sections";
import type { Employee } from "@/types/database.types";

type SettingsSectionContentProps = {
  section: SettingsSectionId;
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

export default function SettingsSectionContent({
  section,
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
}: SettingsSectionContentProps) {
  if (section === "usuario") {
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

  return (
    <SettingsClinicPanel
      clinic={clinic}
      loading={clinicLoading}
      activeEmployeesCount={activeEmployeesCount}
    />
  );
}
