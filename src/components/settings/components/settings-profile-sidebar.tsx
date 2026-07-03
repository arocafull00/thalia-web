import SettingsProfileHeader from "@/components/settings/components/settings-profile-header";
import SettingsProfileQuickActions from "@/components/settings/components/settings-profile-quick-actions";
import SettingsProfileSummary from "@/components/settings/components/settings-profile-summary";
import type { Employee } from "@/types/database.types";

type SettingsProfileSidebarProps = {
  activeEmployeesCount: number;
  canViewClinicRequests: boolean;
  displayUri: string | null;
  isAdmin: boolean;
  onPickAvatar: () => void;
  pendingRequestsCount: number;
  profile: Employee;
  uploadPending: boolean;
  userEmail: string | undefined;
};

export default function SettingsProfileSidebar({
  activeEmployeesCount,
  canViewClinicRequests,
  displayUri,
  isAdmin,
  onPickAvatar,
  pendingRequestsCount,
  profile,
  uploadPending,
  userEmail,
}: SettingsProfileSidebarProps) {
  return (
    <aside className="flex h-full min-h-0 flex-col border-r border-border-subtle">
      <SettingsProfileHeader
        displayUri={displayUri}
        isAdmin={isAdmin}
        onPickAvatar={onPickAvatar}
        profile={profile}
        uploadPending={uploadPending}
        userEmail={userEmail}
      />

      <div className="border-t border-border-subtle" />

      <div className="min-h-0 flex-1 overflow-y-auto">
        <SettingsProfileSummary
          activeEmployeesCount={activeEmployeesCount}
          canViewClinicRequests={canViewClinicRequests}
          isAdmin={isAdmin}
          pendingRequestsCount={pendingRequestsCount}
        />
      </div>

      <div className="mt-auto shrink-0 border-t border-border-subtle">
        <SettingsProfileQuickActions />
      </div>
    </aside>
  );
}
