import PwaInstallPanel from "@/components/pwa/components/pwa-install-panel";
import SettingsAccountPanel from "@/components/settings/components/settings-account-panel";
import SettingsProfileSummary from "@/components/settings/components/settings-profile-summary";
import SettingsWhatsAppPanel from "@/components/settings/components/settings-whatsapp-panel";
import type { SettingsTabId } from "@/lib/hooks/use-settings-tabs";

type SettingsDetailTabContentProps = {
  activeTab: SettingsTabId;
  activeEmployeesCount: number;
  canViewClinicRequests: boolean;
  isAdmin: boolean;
  onChangePassword: () => void;
  onSignOut: () => void;
  passwordMessage: string | null;
  passwordSubmitting: boolean;
  pendingRequestsCount: number;
  signOutSubmitting: boolean;
};

export default function SettingsDetailTabContent({
  activeTab,
  activeEmployeesCount,
  canViewClinicRequests,
  isAdmin,
  onChangePassword,
  onSignOut,
  passwordMessage,
  passwordSubmitting,
  pendingRequestsCount,
  signOutSubmitting,
}: SettingsDetailTabContentProps) {
  if (activeTab === "summary") {
    return (
      <SettingsProfileSummary
        activeEmployeesCount={activeEmployeesCount}
        canViewClinicRequests={canViewClinicRequests}
        isAdmin={isAdmin}
        pendingRequestsCount={pendingRequestsCount}
      />
    );
  }

  if (activeTab === "account") {
    return (
      <SettingsAccountPanel
        onChangePassword={onChangePassword}
        onSignOut={onSignOut}
        passwordMessage={passwordMessage}
        passwordSubmitting={passwordSubmitting}
        signOutSubmitting={signOutSubmitting}
      />
    );
  }

  if (activeTab === "whatsapp") {
    return <SettingsWhatsAppPanel />;
  }

  return <PwaInstallPanel />;
}
