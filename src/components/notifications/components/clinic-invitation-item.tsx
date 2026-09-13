"use client";

import { ArrowRight, Building2 } from "lucide-react";

import { CLINIC_INVITATION_COPY } from "@/copy/clinic-invitation-copy";
import type { PendingClinicRequest } from "@/lib/clinic-requests";

type ClinicInvitationItemProps = {
  invitation: PendingClinicRequest;
  onSelect: (invitation: PendingClinicRequest) => void;
};

export default function ClinicInvitationItem({
  invitation,
  onSelect,
}: ClinicInvitationItemProps) {
  const roleLabel = CLINIC_INVITATION_COPY.roleLabels[invitation.role];

  return (
    <button
      type="button"
      onClick={() => onSelect(invitation)}
      aria-label={CLINIC_INVITATION_COPY.reviewAriaLabel(invitation.clinicName)}
      className="flex min-h-11 w-full gap-3 rounded-xl border border-border-subtle bg-surface p-4 text-left outline-none transition-colors hover:bg-surface-secondary focus-visible:ring-2 focus-visible:ring-primary"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary-subtle">
        <Building2 className="size-4 text-primary-light" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-medium text-ink">
          {CLINIC_INVITATION_COPY.notificationTitle(invitation.clinicName)}
        </span>
        <span className="mt-0.5 block text-xs text-ink-secondary">
          {CLINIC_INVITATION_COPY.notificationBody(roleLabel)}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 self-center text-xs text-ink-secondary">
        {CLINIC_INVITATION_COPY.review}
        <ArrowRight className="size-3" aria-hidden="true" />
      </span>
    </button>
  );
}
