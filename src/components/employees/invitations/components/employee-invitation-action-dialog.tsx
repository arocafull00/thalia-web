"use client";

import AppConfirmDialog from "@/components/ui/app-confirm-dialog";
import { EMPLOYEE_INVITATIONS_COPY } from "@/copy/employee-invitations-copy";
import type { EmployeeInvitationAction } from "@/components/employees/invitations/hooks/use-employee-invitations";
import type { PendingEmployeeInvitation } from "@/types/database.types";

type EmployeeInvitationActionDialogProps = {
  action: EmployeeInvitationAction;
  invitation: PendingEmployeeInvitation;
  isPending: boolean;
  errorMessage: string | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function EmployeeInvitationActionDialog({
  action,
  invitation,
  isPending,
  errorMessage,
  onClose,
  onConfirm,
}: EmployeeInvitationActionDialogProps) {
  const copy = EMPLOYEE_INVITATIONS_COPY[action];

  return (
    <AppConfirmDialog
      open
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
      title={copy.title}
      description={copy.description(invitation.email)}
      confirmLabel={copy.confirm}
      cancelLabel={EMPLOYEE_INVITATIONS_COPY.common.dismiss}
      pendingLabel={copy.pending}
      isPending={isPending}
      onConfirm={onConfirm}
      confirmTone={action === "cancel" ? "danger" : "primary"}
      errorMessage={errorMessage ?? undefined}
    />
  );
}
