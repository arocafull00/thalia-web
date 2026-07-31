import { Users } from "lucide-react";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";

const { segmentPreview } = MARKETING_COPY;

type CampaignRecipientsPreviewProps = {
  count: number | null;
  isLoading: boolean;
  hasError: boolean;
};

function resolveMessage(
  count: number | null,
  isLoading: boolean,
  hasError: boolean,
): string {
  if (hasError) {
    return segmentPreview.error;
  }

  if (isLoading || count == null) {
    return segmentPreview.loading;
  }

  if (count === 0) {
    return segmentPreview.none;
  }

  if (count === 1) {
    return segmentPreview.one;
  }

  return segmentPreview.many(count);
}

export default function CampaignRecipientsPreview({
  count,
  isLoading,
  hasError,
}: CampaignRecipientsPreviewProps) {
  const tone = hasError ? "text-danger" : "text-ink";

  return (
    <div
      data-testid="campaign-recipients-preview"
      className="rounded-xl border border-border-subtle bg-surface-secondary px-4 py-3"
    >
      <div className="flex items-center gap-2">
        <Users size={16} strokeWidth={1.5} className="text-ink-muted" />
        <span className={`text-sm font-medium ${tone}`}>
          {resolveMessage(count, isLoading, hasError)}
        </span>
      </div>
      <p className="mt-1 text-xs text-ink-muted">
        {segmentPreview.consentNote}
      </p>
    </div>
  );
}
