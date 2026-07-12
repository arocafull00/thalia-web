import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import type { Treatment } from "@/types/database.types";

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
  const treatmentOptions = treatments.map((treatment) => ({
    value: treatment.id,
    label: treatment.name,
  }));

  return (
    <AppSearchableCombobox
      value={value || null}
      onValueChange={(nextValue) => onChange(nextValue ?? "")}
      options={treatmentOptions}
      placeholder={PATIENT_GALLERY_COPY.uploader.treatmentPlaceholder}
      searchPlaceholder={PATIENT_GALLERY_COPY.uploader.fields.treatment}
      allowClear
      clearLabel={PATIENT_GALLERY_COPY.uploader.treatmentPlaceholder}
    />
  );
}
