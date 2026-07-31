import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { Badge } from "@/components/ui/badge";
import type { CampaignRecipientStatus } from "@/types/database.types";

type CampaignRecipientStatusBadgeProps = {
  status: CampaignRecipientStatus;
};

const statusVariants: Record<
  CampaignRecipientStatus,
  "default" | "success" | "danger"
> = {
  pending: "default",
  sent: "success",
  failed: "danger",
};

export default function CampaignRecipientStatusBadge({
  status,
}: CampaignRecipientStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]}>
      {MARKETING_COPY.detail.recipients[status]}
    </Badge>
  );
}
