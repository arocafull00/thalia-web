"use client";

import ClinicInvitationItem from "@/components/notifications/components/clinic-invitation-item";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/primitives/notice";
import { CLINIC_INVITATION_COPY } from "@/copy/clinic-invitation-copy";
import type { PendingClinicRequest } from "@/lib/clinic-requests";
import type { QueryEntry } from "@/stores/query-state";

type ClinicInvitationsSectionProps = {
  invitations: QueryEntry<PendingClinicRequest[]>;
  onSelect: (invitation: PendingClinicRequest) => void;
  onRetry: () => void;
};

export default function ClinicInvitationsSection({
  invitations,
  onSelect,
  onRetry,
}: ClinicInvitationsSectionProps) {
  const items = invitations.data ?? [];

  return (
    <section className="space-y-3" aria-labelledby="clinic-invitations-title">
      <h2
        id="clinic-invitations-title"
        className="text-xs font-semibold uppercase tracking-wide text-ink-muted"
      >
        {CLINIC_INVITATION_COPY.sectionTitle}
      </h2>
      {invitations.error && items.length === 0 ? (
        <div className="space-y-2">
          <Notice tone="danger" message={CLINIC_INVITATION_COPY.loadError} />
          <Button type="button" variant="outline" size="sm" onClick={onRetry}>
            {CLINIC_INVITATION_COPY.retry}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((invitation) => (
            <ClinicInvitationItem
              key={invitation.token}
              invitation={invitation}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </section>
  );
}
