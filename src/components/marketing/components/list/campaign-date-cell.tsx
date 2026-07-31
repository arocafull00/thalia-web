import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { formatDate } from "@/lib/format";
import type { Campaign } from "@/types/database.types";

type CampaignDateCellProps = {
  campaign: Campaign;
};

/**
 * La fecha relevante depende del estado: una programada se juzga por cuándo
 * saldrá, una enviada por cuándo salió, y el resto por cuándo se creó.
 */
export default function CampaignDateCell({ campaign }: CampaignDateCellProps) {
  const { list } = MARKETING_COPY;

  if (campaign.status === "scheduled" && campaign.scheduled_at) {
    return (
      <span className="text-sm text-ink-secondary">
        {list.scheduledFor} {formatDate(campaign.scheduled_at)}
      </span>
    );
  }

  if (campaign.status === "sent" && campaign.sent_at) {
    return (
      <span className="text-sm text-ink-secondary">
        {list.sentOn} {formatDate(campaign.sent_at)}
      </span>
    );
  }

  return (
    <span className="text-sm text-ink-muted">
      {list.createdOn} {formatDate(campaign.created_at)}
    </span>
  );
}
