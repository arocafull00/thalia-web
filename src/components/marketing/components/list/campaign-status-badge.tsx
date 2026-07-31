import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { Badge } from "@/components/ui/badge";
import type { CampaignStatus } from "@/types/database.types";

type CampaignStatusBadgeProps = {
  status: CampaignStatus;
};

const statusVariants: Record<
  CampaignStatus,
  "default" | "success" | "warning" | "danger" | "muted"
> = {
  draft: "muted",
  scheduled: "warning",
  sent: "success",
  cancelled: "danger",
};

export default function CampaignStatusBadge({
  status,
}: CampaignStatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status]}>
      {MARKETING_COPY.status[status]}
    </Badge>
  );
}
