import CampaignRecipientStatusBadge from "@/components/marketing/components/detail/campaign-recipient-status-badge";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import type { CampaignRecipientWithPatient } from "@/types/database.types";

const { detail } = MARKETING_COPY;

type CampaignRecipientsListProps = {
  recipients: CampaignRecipientWithPatient[];
};

export default function CampaignRecipientsList({
  recipients,
}: CampaignRecipientsListProps) {
  if (recipients.length === 0) {
    return (
      <p
        data-testid="campaign-recipients-empty"
        className="rounded-xl border border-border-subtle px-4 py-6 text-center text-sm text-ink-muted"
      >
        {detail.recipients.empty}
      </p>
    );
  }

  return (
    <ul data-testid="campaign-recipients-list" className="space-y-2">
      {recipients.map((recipient) => (
        <li
          key={recipient.id}
          className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border-subtle px-4 py-3"
        >
          <span className="min-w-0">
            <span className="block truncate text-sm font-medium text-ink">
              {recipient.patients?.full_name ?? recipient.phone}
            </span>
            <span className="text-xs text-ink-muted">{recipient.phone}</span>
          </span>
          <span className="flex items-center gap-2">
            {recipient.error_message ? (
              <span className="max-w-[16rem] truncate text-xs text-danger">
                {recipient.error_message}
              </span>
            ) : null}
            <CampaignRecipientStatusBadge status={recipient.status} />
          </span>
        </li>
      ))}
    </ul>
  );
}
