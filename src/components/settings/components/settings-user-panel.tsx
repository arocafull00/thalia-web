import SettingsAccountPanel from "@/components/settings/components/settings-account-panel";
import SettingsDetailHeader from "@/components/settings/components/settings-detail-header";
import type { Employee } from "@/types/database.types";

type SettingsUserPanelProps = {
  profile: Employee;
  userEmail: string | undefined;
  avatarDisplayUri: string | null;
  avatarUploadPending: boolean;
  onAvatarFileSelected: (file: File) => void;
  onChangePassword: () => void;
  onSignOut: () => void;
  passwordMessage: string | null;
  passwordSubmitting: boolean;
  signOutSubmitting: boolean;
};

export default function SettingsUserPanel({
  profile,
  userEmail,
  avatarDisplayUri,
  avatarUploadPending,
  onAvatarFileSelected,
  onChangePassword,
  onSignOut,
  passwordMessage,
  passwordSubmitting,
  signOutSubmitting,
}: SettingsUserPanelProps) {
  return (
    <div className="flex flex-col gap-6">
      <SettingsDetailHeader
        profile={profile}
        userEmail={userEmail}
        avatarDisplayUri={avatarDisplayUri}
        avatarUploadPending={avatarUploadPending}
        onAvatarFileSelected={onAvatarFileSelected}
      />
      <SettingsAccountPanel
        onChangePassword={onChangePassword}
        onSignOut={onSignOut}
        passwordMessage={passwordMessage}
        passwordSubmitting={passwordSubmitting}
        signOutSubmitting={signOutSubmitting}
      />
    </div>
  );
}
