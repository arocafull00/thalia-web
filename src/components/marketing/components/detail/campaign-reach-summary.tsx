import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { Stat } from "@/components/ui/primitives/stat";
import type { CampaignRecipientWithPatient } from "@/types/database.types";

const { reach } = MARKETING_COPY.detail;

type CampaignReachSummaryProps = {
  recipients: CampaignRecipientWithPatient[];
};

export default function CampaignReachSummary({
  recipients,
}: CampaignReachSummaryProps) {
  if (recipients.length === 0) {
    return null;
  }

  const sent = recipients.filter((entry) => entry.status === "sent").length;
  const failed = recipients.filter((entry) => entry.status === "failed").length;
  const pending = recipients.length - sent - failed;

  return (
    <div
      data-testid="campaign-reach-summary"
      className="grid grid-cols-3 divide-x divide-border-subtle px-3"
    >
      <Stat label={reach.reached} value={sent} tone="success" />
      <Stat
        label={reach.failed}
        value={failed}
        tone={failed > 0 ? "danger" : "primary"}
      />
      <Stat
        label={pending > 0 ? reach.pending : reach.total}
        value={pending > 0 ? pending : recipients.length}
      />
    </div>
  );
}
