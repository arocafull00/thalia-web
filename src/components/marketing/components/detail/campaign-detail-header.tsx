import CampaignStatusBadge from "@/components/marketing/components/list/campaign-status-badge";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { formatDate } from "@/lib/format";
import type { Campaign } from "@/types/database.types";

type CampaignDetailHeaderProps = {
  campaign: Campaign;
};

export default function CampaignDetailHeader({
  campaign,
}: CampaignDetailHeaderProps) {
  const { list } = MARKETING_COPY;

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="min-w-0 text-2xl font-medium tracking-tight text-ink">
          {campaign.title}
        </h1>
        <CampaignStatusBadge status={campaign.status} />
      </div>
      <p className="text-sm text-ink-muted">
        {campaign.sent_at
          ? `${list.sentOn} ${formatDate(campaign.sent_at)}`
          : `${list.createdOn} ${formatDate(campaign.created_at)}`}
      </p>
    </div>
  );
}
