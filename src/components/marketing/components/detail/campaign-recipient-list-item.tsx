import Link from "next/link";

import CampaignRecipientStatusBadge from "@/components/marketing/components/detail/campaign-recipient-status-badge";
import type { CampaignRecipientWithPatient } from "@/types/database.types";

type CampaignRecipientListItemProps = {
  recipient: CampaignRecipientWithPatient;
};

const rowClassName =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 px-4 py-3 md:grid-cols-[minmax(0,1fr)_10rem_minmax(12rem,1fr)]";

export default function CampaignRecipientListItem({
  recipient,
}: CampaignRecipientListItemProps) {
  const patientId = recipient.patients?.id;
  const content = (
    <>
      <span className="min-w-0 truncate text-sm font-medium text-ink">
        {recipient.patients?.full_name ?? recipient.phone}
      </span>
      <span className="text-right md:order-3 md:text-left">
        <CampaignRecipientStatusBadge status={recipient.status} />
      </span>
      <span className="text-xs tabular-nums text-ink-muted md:order-2 md:text-sm">
        {recipient.phone}
      </span>
      {recipient.error_message ? (
        <span
          title={recipient.error_message}
          className="col-span-2 truncate text-xs text-danger md:order-4 md:col-start-3 md:col-end-4"
        >
          {recipient.error_message}
        </span>
      ) : null}
    </>
  );

  if (!patientId) {
    return <li className={rowClassName}>{content}</li>;
  }

  return (
    <li>
      <Link
        href={`/patients/${patientId}`}
        className={`${rowClassName} transition-colors hover:bg-[var(--hover-overlay)]`}
      >
        {content}
      </Link>
    </li>
  );
}
