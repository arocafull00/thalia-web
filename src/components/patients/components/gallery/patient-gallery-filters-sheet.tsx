"use client";

import { useState } from "react";

import type { PatientGalleryFilterValues } from "@/components/patients/components/gallery/hooks/use-patient-gallery";
import AppDateField from "@/components/ui/app-date-field";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import FiltersSheet from "@/components/ui/filters-sheet";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";
import {
  formatLocalDateInputValue,
  parseLocalDateInputValue,
} from "@/lib/date-input";

const sortOptions = [
  { label: PATIENT_GALLERY_COPY.filters.sortRecent, value: "recent" },
  { label: PATIENT_GALLERY_COPY.filters.sortOldest, value: "oldest" },
];

function parseDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? parseLocalDateInputValue(value)
    : null;
}

type PatientGalleryFiltersSheetProps = {
  open: boolean;
  filters: PatientGalleryFilterValues;
  phaseOptions: Array<{ label: string; value: string }>;
  treatmentOptions: Array<{ label: string; value: string }>;
  onApply: (updates: PatientGalleryFilterValues) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function PatientGalleryFiltersSheet({
  open,
  filters,
  phaseOptions,
  treatmentOptions,
  onApply,
  onClear,
  onDismiss,
}: PatientGalleryFiltersSheetProps) {
  const [pending, setPending] = useState<PatientGalleryFilterValues>(filters);
  const pendingFrom = parseDate(pending.from);
  const pendingTo = parseDate(pending.to);

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
      contentClassName="min-h-[72dvh]"
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
              setPending((current) => ({
                ...current,
                phase: value ?? "",
              }))
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
        label={PATIENT_GALLERY_COPY.filterLabels.treatment}
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.treatmentId || null}
            onValueChange={(value) =>
              setPending((current) => ({
                ...current,
                treatmentId: value ?? "",
              }))
            }
            options={treatmentOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.allTreatments}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.treatment}
            allowClear
            clearLabel={PATIENT_GALLERY_COPY.filters.allTreatments}
          />
        )}
      </FilterField>

      <div className="space-y-3">
        <FilterField
          variant="sheet"
          label={PATIENT_GALLERY_COPY.filterLabels.dateFrom}
        >
          {({ controlId }) => (
            <AppDateField
              id={controlId}
              value={pendingFrom}
              onChange={(value) =>
                setPending((current) => ({
                  ...current,
                  from: formatLocalDateInputValue(value),
                }))
              }
              maxDate={pendingTo ?? undefined}
            />
          )}
        </FilterField>
        <FilterField
          variant="sheet"
          label={PATIENT_GALLERY_COPY.filterLabels.dateTo}
        >
          {({ controlId }) => (
            <AppDateField
              id={controlId}
              value={pendingTo}
              onChange={(value) =>
                setPending((current) => ({
                  ...current,
                  to: formatLocalDateInputValue(value),
                }))
              }
              minDate={pendingFrom ?? undefined}
            />
          )}
        </FilterField>
      </div>

      <FilterField
        variant="sheet"
        label={PATIENT_GALLERY_COPY.filterLabels.sort}
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.sort}
            onValueChange={(value) =>
              setPending((current) => ({
                ...current,
                sort: value === "oldest" ? "oldest" : "recent",
              }))
            }
            options={sortOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.sortRecent}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.sort}
            showSearch={false}
          />
        )}
      </FilterField>
    </FiltersSheet>
  );
}
