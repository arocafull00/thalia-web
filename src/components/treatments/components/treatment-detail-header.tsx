import { Clock, Tag } from "lucide-react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { formatCurrency } from "@/lib/format";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentDetailHeaderProps = {
  treatment: TreatmentWithInventory;
};

export default function TreatmentDetailHeader({
  treatment,
}: TreatmentDetailHeaderProps) {
  const subtitleParts = [
    treatment.category,
    `${treatment.duration_minutes ?? 30} ${TREATMENTS_COPY.row.duration}`,
    treatment.price != null ? formatCurrency(treatment.price) : null,
  ].filter(Boolean);

  return (
    <div className="flex shrink-0 items-center justify-between gap-4 px-4 pt-6 pb-6 lg:px-8">
      <div className="flex items-center gap-4">
        <span
          className={`inline-block size-10 shrink-0 rounded-full border border-border ${treatment.color ? "" : "bg-border"}`}
          style={
            treatment.color ? { backgroundColor: treatment.color } : undefined
          }
          aria-hidden="true"
        />

        <div className="min-w-0 space-y-1">
          <h1 className="text-xl font-semibold text-ink">{treatment.name}</h1>
          {subtitleParts.length > 0 ? (
            <p className="text-sm text-ink-secondary">
              {subtitleParts.join(" · ")}
            </p>
          ) : null}
        </div>
      </div>

      <div className="hidden items-center gap-2 sm:flex">
        {treatment.category ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1 text-xs text-ink-secondary">
            <Tag className="size-3.5" aria-hidden="true" />
            {treatment.category}
          </span>
        ) : null}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border-subtle px-3 py-1 text-xs text-ink-secondary">
          <Clock className="size-3.5" aria-hidden="true" />
          {treatment.duration_minutes ?? 30} {TREATMENTS_COPY.row.duration}
        </span>
        {treatment.price != null ? (
          <span className="rounded-full border border-border-subtle px-3 py-1 text-xs font-medium text-ink">
            {formatCurrency(treatment.price)}
          </span>
        ) : null}
      </div>
    </div>
  );
}
