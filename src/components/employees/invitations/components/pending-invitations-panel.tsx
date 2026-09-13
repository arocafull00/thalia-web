import PendingInvitationsTable from "@/components/employees/invitations/components/pending-invitations-table";
import PageCard from "@/components/ui/page-card";
import PageEmptyState from "@/components/ui/page-empty-state";
import { Notice } from "@/components/ui/primitives/notice";
import {
  PAGE_LIST_SKELETON_ROWS,
  SkeletonList,
} from "@/components/ui/primitives/skeleton-list";
import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import type { PendingEmployeeInvitation } from "@/types/database.types";

type PendingInvitationsPanelProps = {
  invitations: PendingEmployeeInvitation[];
  isLoading: boolean;
  error: Error | null;
  onEdit: (invitation: PendingEmployeeInvitation) => void;
  onReactivate: (invitation: PendingEmployeeInvitation) => void;
  onCancel: (invitation: PendingEmployeeInvitation) => void;
};

export default function PendingInvitationsPanel({
  invitations,
  isLoading,
  error,
  onEdit,
  onReactivate,
  onCancel,
}: PendingInvitationsPanelProps) {
  return (
    <PageCard>
      {isLoading ? <SkeletonList count={PAGE_LIST_SKELETON_ROWS} /> : null}
      {error ? (
        <Notice
          tone="danger"
          message={EMPLOYEE_INVITATIONS_COPY.list.loadError}
        />
      ) : null}
      {!isLoading && !error && invitations.length === 0 ? (
        <PageEmptyState message={EMPLOYEE_INVITATIONS_COPY.list.empty} />
      ) : null}
      {!isLoading && invitations.length > 0 ? (
        <PendingInvitationsTable
          invitations={invitations}
          onEdit={onEdit}
          onReactivate={onReactivate}
          onCancel={onCancel}
        />
      ) : null}
    </PageCard>
  );
}
