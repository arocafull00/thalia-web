import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import type { CampaignSegmentInputs } from "@/lib/hooks/use-campaign-create-dialog";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const { fields, sections } = MARKETING_COPY.createDialog;

export type TreatmentOption = {
  id: string;
  name: string;
};

type CampaignSegmentFieldsProps = {
  inputs: CampaignSegmentInputs;
  treatments: TreatmentOption[];
  onChange: (field: keyof CampaignSegmentInputs, value: string) => void;
};

export default function CampaignSegmentFields({
  inputs,
  treatments,
  onChange,
}: CampaignSegmentFieldsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-ink">{sections.segment}</h3>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">{fields.treatment}</span>
        <select
          value={inputs.treatmentId}
          onChange={(event) => onChange("treatmentId", event.target.value)}
          className={inputClassName}
        >
          <option value="">{fields.anyTreatment}</option>
          {treatments.map((treatment) => (
            <option key={treatment.id} value={treatment.id}>
              {treatment.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm text-ink-secondary">
          {fields.monthsSinceLastVisit}
        </span>
        <input
          type="number"
          min="1"
          value={inputs.monthsSinceLastVisit}
          onChange={(event) =>
            onChange("monthsSinceLastVisit", event.target.value)
          }
          className={inputClassName}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">{fields.minVisits}</span>
          <input
            type="number"
            min="0"
            value={inputs.minVisits}
            onChange={(event) => onChange("minVisits", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">{fields.maxVisits}</span>
          <input
            type="number"
            min="0"
            value={inputs.maxVisits}
            onChange={(event) => onChange("maxVisits", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">{fields.minAge}</span>
          <input
            type="number"
            min="0"
            value={inputs.minAge}
            onChange={(event) => onChange("minAge", event.target.value)}
            className={inputClassName}
          />
        </label>
        <label className="block space-y-1.5">
          <span className="text-sm text-ink-secondary">{fields.maxAge}</span>
          <input
            type="number"
            min="0"
            value={inputs.maxAge}
            onChange={(event) => onChange("maxAge", event.target.value)}
            className={inputClassName}
          />
        </label>
      </div>
    </div>
  );
}
