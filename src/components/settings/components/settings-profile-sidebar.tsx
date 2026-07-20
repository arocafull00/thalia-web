import SettingsProfileHeader from "@/components/settings/components/settings-profile-header";
import SettingsProfileQuickActions from "@/components/settings/components/settings-profile-quick-actions";
import SettingsProfileSummary from "@/components/settings/components/settings-profile-summary";
import type { Employee } from "@/types/database.types";

type SettingsProfileSidebarProps = {
  canViewClinicRequests: boolean;
  displayUri: string | null;
  isAdmin: boolean;
  onEdit: () => void;
  onPickAvatar: () => void;
  pendingRequestsCount: number;
  profile: Employee;
  uploadPending: boolean;
  userEmail: string | undefined;
};

export default function SettingsProfileSidebar({
  canViewClinicRequests,
  displayUri,
  isAdmin,
  onEdit,
  onPickAvatar,
  pendingRequestsCount,
  profile,
  uploadPending,
  userEmail,
}: SettingsProfileSidebarProps) {
  return (
    <aside className="order-1 flex flex-col border-b border-border-subtle lg:order-1 lg:h-full lg:min-h-0 lg:border-b-0 lg:border-r">
      <SettingsProfileHeader
        displayUri={displayUri}
        isAdmin={isAdmin}
        onPickAvatar={onPickAvatar}
        profile={profile}
        uploadPending={uploadPending}
        userEmail={userEmail}
      />

      <div className="border-t border-border-subtle" />

      <div className="lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
        <SettingsProfileSummary
          canViewClinicRequests={canViewClinicRequests}
          pendingRequestsCount={pendingRequestsCount}
        />
      </div>

      <div className="hidden border-t border-border-subtle lg:mt-auto lg:block lg:shrink-0">
        <SettingsProfileQuickActions onEdit={onEdit} />
      </div>
    </aside>
  );
}
