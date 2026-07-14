import { Clock, Palette, Tag, Wallet } from "lucide-react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { ProfileInfoRow } from "@/components/ui/profile/profile-info-row";
import { TREATMENT_DETAIL_COPY } from "@/copy/treatment-detail-copy";
import { formatCurrency } from "@/lib/format";
import type { TreatmentWithInventory } from "@/types/database.types";

type TreatmentDetailInfoSectionProps = {
  treatment: TreatmentWithInventory;
};

export default function TreatmentDetailInfoSection({
  treatment,
}: TreatmentDetailInfoSectionProps) {
  return (
    <section aria-label={TREATMENT_DETAIL_COPY.sections.info}>
      <h2 className="border-b border-border-subtle pb-4 text-sm font-medium text-ink">
        {TREATMENT_DETAIL_COPY.sections.info}
      </h2>
      <div className="divide-y divide-border-subtle">
        <ProfileInfoRow
          icon={Tag}
          iconLabel={TREATMENT_DETAIL_COPY.fields.category}
          label={TREATMENT_DETAIL_COPY.fields.category}
          value={treatment.category}
        />
        <ProfileInfoRow
          icon={Clock}
          iconLabel={TREATMENT_DETAIL_COPY.fields.duration}
          label={TREATMENT_DETAIL_COPY.fields.duration}
          value={`${treatment.duration_minutes ?? 30} ${TREATMENTS_COPY.row.duration}`}
        />
        <ProfileInfoRow
          icon={Wallet}
          iconLabel={TREATMENT_DETAIL_COPY.fields.price}
          label={TREATMENT_DETAIL_COPY.fields.price}
          value={
            treatment.price != null ? formatCurrency(treatment.price) : null
          }
        />
        <ProfileInfoRow
          icon={Palette}
          iconLabel={TREATMENT_DETAIL_COPY.fields.color}
          label={TREATMENT_DETAIL_COPY.fields.color}
        >
          <div className="flex items-center gap-2">
            <span
              className={`inline-block size-4 rounded-full border border-border ${treatment.color ? "" : "bg-border"}`}
              style={
                treatment.color
                  ? { backgroundColor: treatment.color }
                  : undefined
              }
              aria-hidden="true"
            />
            <span>{treatment.color ?? "—"}</span>
          </div>
        </ProfileInfoRow>
      </div>
    </section>
  );
}
