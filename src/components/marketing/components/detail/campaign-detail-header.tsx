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
    <div className="flex flex-col gap-2 px-4 pb-4 pt-6 lg:px-8">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-medium text-ink">{campaign.title}</h1>
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
