"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import { PATIENT_FILES_COPY } from "@/copy/patient-files-copy";
import type { PatientFileCategory } from "@/types/database.types";

type PatientFileCategoryFilterProps = {
  value: PatientFileCategory | "";
  onChange: (value: PatientFileCategory | "") => void;
};

const categoryOptions = [
  { label: PATIENT_FILES_COPY.categories.all, value: "" },
  ...Object.entries(PATIENT_FILES_COPY.categories)
    .filter(([key]) => key !== "all")
    .map(([value, label]) => ({ label, value })),
];

export default function PatientFileCategoryFilter({
  value,
  onChange,
}: PatientFileCategoryFilterProps) {
  return (
    <FilterField label={PATIENT_FILES_COPY.filterLabels.category}>
      {({ controlId }) => (
        <AppSearchableCombobox
          id={controlId}
          value={value || null}
          onValueChange={(nextValue) =>
            onChange((nextValue ?? "") as PatientFileCategory | "")
          }
          options={categoryOptions}
          placeholder={PATIENT_FILES_COPY.filters.categoryPlaceholder}
          searchPlaceholder={PATIENT_FILES_COPY.filters.category}
          allowClear
          clearLabel={PATIENT_FILES_COPY.categories.all}
          showSearch={false}
        />
      )}
    </FilterField>
  );
}
