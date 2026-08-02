import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import type {
  CampaignSegmentInputErrors,
  CampaignSegmentInputs,
} from "@/lib/schemas/campaign-segment-schema";

const inputClassName =
  "w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

const invalidClassName = "border-danger";

const { fields, sections } = MARKETING_COPY.createDialog;

export type TreatmentOption = {
  id: string;
  name: string;
};

type NumericField = Exclude<keyof CampaignSegmentInputs, "treatmentId">;

type CampaignSegmentFieldsProps = {
  inputs: CampaignSegmentInputs;
  errors: CampaignSegmentInputErrors;
  treatments: TreatmentOption[];
  onChange: (field: keyof CampaignSegmentInputs, value: string) => void;
};

export default function CampaignSegmentFields({
  inputs,
  errors,
  treatments,
  onChange,
}: CampaignSegmentFieldsProps) {
  const numericField = (field: NumericField, label: string, min: number) => (
    <label className="block space-y-1.5">
      <span className="text-sm text-ink-secondary">{label}</span>
      <input
        type="number"
        min={min}
        value={inputs[field]}
        aria-invalid={errors[field] ? true : undefined}
        onChange={(event) => onChange(field, event.target.value)}
        className={`${inputClassName} ${errors[field] ? invalidClassName : ""}`}
      />
      {errors[field] ? (
        <span className="block text-sm text-danger">{errors[field]}</span>
      ) : null}
    </label>
  );

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
      {numericField("monthsSinceLastVisit", fields.monthsSinceLastVisit, 1)}
      <div className="grid gap-4 sm:grid-cols-2">
        {numericField("minVisits", fields.minVisits, 0)}
        {numericField("maxVisits", fields.maxVisits, 0)}
        {numericField("minAge", fields.minAge, 0)}
        {numericField("maxAge", fields.maxAge, 0)}
      </div>
    </div>
  );
}
