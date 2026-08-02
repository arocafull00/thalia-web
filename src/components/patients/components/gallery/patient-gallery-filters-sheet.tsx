"use client";

import { useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import FiltersSheet from "@/components/ui/filters-sheet";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";

const sortOptions = [
  { label: PATIENT_GALLERY_COPY.filters.sortRecent, value: "recent" },
  { label: PATIENT_GALLERY_COPY.filters.sortOldest, value: "oldest" },
];

export type PatientGalleryFilterValues = {
  phase: string;
  sort: string;
};

type PatientGalleryFiltersSheetProps = {
  open: boolean;
  filters: PatientGalleryFilterValues;
  phaseOptions: Array<{ label: string; value: string }>;
  onApply: (updates: PatientGalleryFilterValues) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function PatientGalleryFiltersSheet({
  open,
  filters,
  phaseOptions,
  onApply,
  onClear,
  onDismiss,
}: PatientGalleryFiltersSheetProps) {
  const [pending, setPending] = useState<PatientGalleryFilterValues>(filters);

  const handleApply = () => {
    onApply(pending);
    onDismiss();
  };

  const handleClear = () => {
    onClear();
    onDismiss();
  };

  return (
    <FiltersSheet
      open={open}
      onDismiss={onDismiss}
      onApply={handleApply}
      onClear={handleClear}
    >
      <FilterField
        variant="sheet"
        label={PATIENT_GALLERY_COPY.filterLabels.phase}
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.phase || null}
            onValueChange={(value) =>
              setPending((prev) => ({ ...prev, phase: value ?? "" }))
            }
            options={phaseOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.allPhases}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.phase}
            allowClear
            clearLabel={PATIENT_GALLERY_COPY.filters.allPhases}
          />
        )}
      </FilterField>
      <FilterField
        variant="sheet"
        label={PATIENT_GALLERY_COPY.filterLabels.sort}
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.sort || null}
            onValueChange={(value) =>
              setPending((prev) => ({ ...prev, sort: value ?? "recent" }))
            }
            options={sortOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.sortRecent}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.sort}
          />
        )}
      </FilterField>
    </FiltersSheet>
  );
}
