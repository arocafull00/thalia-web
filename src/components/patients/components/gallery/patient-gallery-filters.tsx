"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";

const sortOptions = [
  { label: PATIENT_GALLERY_COPY.filters.sortRecent, value: "recent" },
  { label: PATIENT_GALLERY_COPY.filters.sortOldest, value: "oldest" },
];

type PatientGalleryFiltersProps = {
  phase: string;
  phaseOptions: Array<{ label: string; value: string }>;
  search: string;
  sort: string;
  onOpenSheet: () => void;
  onPhaseChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function PatientGalleryFilters({
  phase,
  phaseOptions,
  search,
  sort,
  onOpenSheet,
  onPhaseChange,
  onSearchChange,
  onSortChange,
}: PatientGalleryFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchLabel={PATIENT_GALLERY_COPY.filterLabels.search}
      searchPlaceholder={PATIENT_GALLERY_COPY.filters.search}
      searchClearLabel={PATIENT_GALLERY_COPY.filters.searchClear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      <FilterField
        label={PATIENT_GALLERY_COPY.filterLabels.phase}
        className="w-40 shrink-0"
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={phase || null}
            onValueChange={(value) => onPhaseChange(value ?? "")}
            options={phaseOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.allPhases}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.phase}
            allowClear
            clearLabel={PATIENT_GALLERY_COPY.filters.allPhases}
            variant="pill"
            className="w-full"
          />
        )}
      </FilterField>
      <FilterField
        label={PATIENT_GALLERY_COPY.filterLabels.sort}
        className="w-40 shrink-0"
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={sort || null}
            onValueChange={(value) => onSortChange(value ?? "recent")}
            options={sortOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.sortRecent}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.sort}
            variant="pill"
            className="w-full"
          />
        )}
      </FilterField>
    </PageFiltersBar>
  );
}
