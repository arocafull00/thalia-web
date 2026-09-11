"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, RotateCcw, Trash2 } from "lucide-react";

import ListRowActions from "@/components/ui/list-row-actions";
import type { MobileCardColumn } from "@/components/ui/mobile-card-view";
import type { ProfileAction } from "@/components/ui/profile/profile-action";
import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import { formatDate, invitationTokenRoleLabel } from "@/lib/format";
import type { PendingEmployeeInvitation } from "@/types/database.types";

export type PendingInvitationActionHandlers = {
  onEdit: (invitation: PendingEmployeeInvitation) => void;
  onReactivate: (invitation: PendingEmployeeInvitation) => void;
  onCancel: (invitation: PendingEmployeeInvitation) => void;
};

export function getPendingInvitationActions(
  invitation: PendingEmployeeInvitation,
  handlers: PendingInvitationActionHandlers,
): ProfileAction[] {
  return [
    {
      label: EMPLOYEE_INVITATIONS_COPY.actions.edit,
      icon: Pencil,
      onClick: () => handlers.onEdit(invitation),
    },
    {
      label: EMPLOYEE_INVITATIONS_COPY.actions.reactivate,
      icon: RotateCcw,
      onClick: () => handlers.onReactivate(invitation),
    },
    {
      label: EMPLOYEE_INVITATIONS_COPY.actions.cancel,
      icon: Trash2,
      onClick: () => handlers.onCancel(invitation),
      variant: "danger",
    },
  ];
}

export function buildPendingInvitationColumns(
  handlers: PendingInvitationActionHandlers,
): ColumnDef<PendingEmployeeInvitation>[] {
  const columns = EMPLOYEE_INVITATIONS_COPY.list.columns;

  return [
    {
      accessorKey: "email",
      header: columns.email,
      cell: ({ row }) => (
        <span className="font-medium text-ink">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "role",
      header: columns.role,
      cell: ({ row }) => (
        <span className="text-xs uppercase tracking-wide text-ink-secondary">
          {invitationTokenRoleLabel(row.original.role)}
        </span>
      ),
    },
    {
      accessorKey: "created_at",
      header: columns.sentAt,
      cell: ({ row }) => (
        <span className="text-ink-secondary">
          {formatDate(row.original.created_at)}
        </span>
      ),
    },
    {
      accessorKey: "expires_at",
      header: columns.expiresAt,
      cell: ({ row }) => (
        <span className="text-ink-secondary">
          {formatDate(row.original.expires_at)}
        </span>
      ),
    },
    {
      id: "actions",
      header: columns.actions,
      cell: ({ row }) => (
        <ListRowActions
          actions={getPendingInvitationActions(row.original, handlers)}
          label={EMPLOYEE_INVITATIONS_COPY.list.actionsLabel}
        />
      ),
      enableSorting: false,
    },
  ];
}

export const pendingInvitationMobileColumns: MobileCardColumn<PendingEmployeeInvitation>[] =
  [
    {
      key: "email",
      label: EMPLOYEE_INVITATIONS_COPY.list.columns.email,
      render: (invitation) => invitation.email,
      priority: "primary",
    },
    {
      key: "role",
      label: EMPLOYEE_INVITATIONS_COPY.list.columns.role,
      render: (invitation) => invitationTokenRoleLabel(invitation.role),
      priority: "secondary",
    },
    {
      key: "created_at",
      label: EMPLOYEE_INVITATIONS_COPY.list.columns.sentAt,
      render: (invitation) => formatDate(invitation.created_at),
      priority: "secondary",
    },
    {
      key: "expires_at",
      label: EMPLOYEE_INVITATIONS_COPY.list.columns.expiresAt,
      render: (invitation) => formatDate(invitation.expires_at),
      priority: "secondary",
    },
  ];
