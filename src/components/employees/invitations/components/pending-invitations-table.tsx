"use client";

import { useMemo } from "react";

import {
  buildPendingInvitationColumns,
  getPendingInvitationActions,
  pendingInvitationMobileColumns,
  type PendingInvitationActionHandlers,
} from "@/components/employees/invitations/components/pending-invitations-columns";
import { DataTable } from "@/components/ui/data-table";
import ListRowActions from "@/components/ui/list-row-actions";
import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import type { PendingEmployeeInvitation } from "@/types/database.types";

type PendingInvitationsTableProps = PendingInvitationActionHandlers & {
  invitations: PendingEmployeeInvitation[];
};

export default function PendingInvitationsTable({
  invitations,
  onEdit,
  onReactivate,
  onCancel,
}: PendingInvitationsTableProps) {
  const handlers = useMemo(
    () => ({ onEdit, onReactivate, onCancel }),
    [onCancel, onEdit, onReactivate],
  );
  const columns = useMemo(
    () => buildPendingInvitationColumns(handlers),
    [handlers],
  );

  return (
    <DataTable
      columns={columns}
      data={invitations}
      emptyMessage={EMPLOYEE_INVITATIONS_COPY.list.empty}
      mobileColumns={pendingInvitationMobileColumns}
      renderMobileActions={(invitation) => (
        <ListRowActions
          actions={getPendingInvitationActions(invitation, handlers)}
          label={EMPLOYEE_INVITATIONS_COPY.list.actionsLabel}
          variant="menu"
        />
      )}
      getRowActions={(invitation) =>
        getPendingInvitationActions(invitation, handlers)
      }
    />
  );
}
