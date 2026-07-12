import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { Treatment } from "@/types/database.types";

const inputClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type PatientImageTreatmentSelectProps = {
  treatments: Treatment[];
  value: string;
  onChange: (value: string) => void;
};

export default function PatientImageTreatmentSelect({
  treatments,
  value,
  onChange,
}: PatientImageTreatmentSelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={inputClassName}
    >
      <option value="">
        {PATIENT_GALLERY_COPY.uploader.treatmentPlaceholder}
      </option>
      {treatments.map((treatment) => (
        <option key={treatment.id} value={treatment.id}>
          {treatment.name}
        </option>
      ))}
    </select>
  );
}
