import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
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
      className="grid w-full grid-cols-3 divide-x divide-border-subtle xl:w-auto"
    >
      <div className="min-w-24 px-4 first:pl-0 xl:min-w-28">
        <p className="text-xl font-medium tabular-nums text-success">{sent}</p>
        <p className="mt-1 text-xs text-ink-muted">{reach.reached}</p>
      </div>
      <div className="min-w-24 px-4 xl:min-w-28">
        <p
          className={`text-xl font-medium tabular-nums ${failed > 0 ? "text-danger" : "text-primary"}`}
        >
          {failed}
        </p>
        <p className="mt-1 text-xs text-ink-muted">{reach.failed}</p>
      </div>
      <div className="min-w-24 px-4 last:pr-0 xl:min-w-28">
        <p className="text-xl font-medium tabular-nums text-primary">
          {pending > 0 ? pending : recipients.length}
        </p>
        <p className="mt-1 text-xs text-ink-muted">
          {pending > 0 ? reach.pending : reach.total}
        </p>
      </div>
    </div>
  );
}
