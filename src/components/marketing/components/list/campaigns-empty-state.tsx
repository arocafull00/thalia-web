import { Megaphone } from "lucide-react";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";

export default function CampaignsEmptyState() {
  return (
    <div
      data-testid="campaigns-empty-state"
      className="flex min-h-0 flex-1 flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-primary-subtle text-primary">
        <Megaphone size={24} strokeWidth={1.5} />
      </div>
      <h2 className="mt-6 text-lg font-medium text-ink">
        {MARKETING_COPY.empty.title}
      </h2>
      <p className="mt-2 max-w-md text-sm text-ink-secondary">
        {MARKETING_COPY.empty.description}
      </p>
    </div>
  );
}
