"use client";

import { useClinicInvitationDialog } from "@/components/notifications/hooks/use-clinic-invitation-dialog";
import AppDialog from "@/components/ui/app-dialog";
import AppDialogContent from "@/components/ui/app-dialog-content";
import AppDialogDescription from "@/components/ui/app-dialog-description";
import AppDialogFooter from "@/components/ui/app-dialog-footer";
import AppDialogHeader from "@/components/ui/app-dialog-header";
import AppDialogTitle from "@/components/ui/app-dialog-title";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { CLINIC_INVITATION_COPY } from "@/copy/clinic-invitation-copy";
import type { PendingClinicRequest } from "@/lib/clinic-requests";
import { formatDate } from "@/lib/format";

type ClinicInvitationDialogProps = {
  invitation: PendingClinicRequest;
  onClose: () => void;
};

export default function ClinicInvitationDialog({
  invitation,
  onClose,
}: ClinicInvitationDialogProps) {
  const { errorMessage, pendingAction, handleAccept, handleReject } =
    useClinicInvitationDialog(invitation, onClose);
  const copy = CLINIC_INVITATION_COPY.dialog;
  const isPending = pendingAction !== null;

  return (
    <AppDialog
      open
      onOpenChange={(open) => {
        if (!open && !isPending) {
          onClose();
        }
      }}
    >
      <AppDialogContent>
        <AppDialogHeader>
          <AppDialogTitle>{copy.title}</AppDialogTitle>
          <AppDialogDescription>
            {copy.description(invitation.clinicName)}
          </AppDialogDescription>
        </AppDialogHeader>
        <dl className="mt-6 divide-y divide-border-subtle border-y border-border-subtle">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-ink-secondary">{copy.fields.clinic}</dt>
            <dd className="text-right text-sm font-medium text-ink">
              {invitation.clinicName}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-ink-secondary">{copy.fields.role}</dt>
            <dd className="text-right text-sm font-medium text-ink">
              {CLINIC_INVITATION_COPY.roleLabels[invitation.role]}
            </dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-sm text-ink-secondary">
              {copy.fields.expiresAt}
            </dt>
            <dd className="text-right text-sm font-medium text-ink">
              {formatDate(invitation.expiresAt)}
            </dd>
          </div>
        </dl>
        <AppDialogFooter errorMessage={errorMessage ?? undefined}>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isPending}
            onClick={handleReject}
          >
            {pendingAction === "reject"
              ? copy.actions.rejecting
              : copy.actions.reject}
          </Button>
          <ActionButton
            title={
              pendingAction === "accept"
                ? copy.actions.accepting
                : copy.actions.accept
            }
            disabled={isPending}
            onClick={handleAccept}
          />
        </AppDialogFooter>
      </AppDialogContent>
    </AppDialog>
  );
}
