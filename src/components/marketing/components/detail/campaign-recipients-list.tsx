import CampaignRecipientListItem from "@/components/marketing/components/detail/campaign-recipient-list-item";
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
        className="py-6 text-sm text-ink-secondary"
      >
        {detail.recipients.empty}
      </p>
    );
  }

  return (
    <div className="min-h-0 lg:flex lg:flex-1 lg:flex-col">
      <div className="hidden shrink-0 grid-cols-[minmax(0,1fr)_10rem_minmax(12rem,1fr)] gap-4 border-b border-border px-4 pb-3 text-xs font-medium uppercase tracking-wide text-ink-muted md:grid">
        <span>{detail.recipients.columnPatient}</span>
        <span>{detail.recipients.columnPhone}</span>
        <span>{detail.recipients.columnStatus}</span>
      </div>
      <ul
        data-testid="campaign-recipients-list"
        className="divide-y divide-border-subtle lg:min-h-0 lg:flex-1 lg:overflow-y-auto"
      >
        {recipients.map((recipient) => (
          <CampaignRecipientListItem key={recipient.id} recipient={recipient} />
        ))}
      </ul>
    </div>
  );
}
