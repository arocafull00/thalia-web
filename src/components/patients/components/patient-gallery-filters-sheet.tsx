"use client";

import { useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FiltersSheet from "@/components/ui/filters-sheet";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";

const sortOptions = [
  { label: PATIENT_GALLERY_COPY.filters.sortRecent, value: "recent" },
  { label: PATIENT_GALLERY_COPY.filters.sortOldest, value: "oldest" },
];

export type PatientGalleryFilterValues = {
  category: string;
  phase: string;
  sort: string;
};

type PatientGalleryFiltersSheetProps = {
  open: boolean;
  filters: PatientGalleryFilterValues;
  categoryOptions: Array<{ label: string; value: string }>;
  phaseOptions: Array<{ label: string; value: string }>;
  onApply: (updates: PatientGalleryFilterValues) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function PatientGalleryFiltersSheet({
  open,
  filters,
  categoryOptions,
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
      {categoryOptions.length > 0 ? (
        <div className="space-y-2">
          <p className="text-sm font-medium text-ink">
            {PATIENT_GALLERY_COPY.filters.category}
          </p>
          <AppSearchableCombobox
            value={pending.category || null}
            onValueChange={(value) =>
              setPending((prev) => ({ ...prev, category: value ?? "" }))
            }
            options={categoryOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.all}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.category}
            allowClear
            clearLabel={PATIENT_GALLERY_COPY.filters.all}
          />
        </div>
      ) : null}
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {PATIENT_GALLERY_COPY.filters.phase}
        </p>
        <AppSearchableCombobox
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
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {PATIENT_GALLERY_COPY.filters.sort}
        </p>
        <AppSearchableCombobox
          value={pending.sort || null}
          onValueChange={(value) =>
            setPending((prev) => ({ ...prev, sort: value ?? "recent" }))
          }
          options={sortOptions}
          placeholder={PATIENT_GALLERY_COPY.filters.sortRecent}
          searchPlaceholder={PATIENT_GALLERY_COPY.filters.sort}
        />
      </div>
    </FiltersSheet>
  );
}
