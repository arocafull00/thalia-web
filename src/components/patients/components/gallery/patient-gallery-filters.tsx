"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";

import PatientGalleryDateRangeFilter from "./patient-gallery-date-range-filter";

const sortOptions = [
  { label: PATIENT_GALLERY_COPY.filters.sortRecent, value: "recent" },
  { label: PATIENT_GALLERY_COPY.filters.sortOldest, value: "oldest" },
];

type PatientGalleryFiltersProps = {
  from: string;
  phase: string;
  phaseOptions: Array<{ label: string; value: string }>;
  search: string;
  sort: string;
  to: string;
  treatmentId: string;
  treatmentOptions: Array<{ label: string; value: string }>;
  onClearDates: () => void;
  onFromChange: (value: string) => void;
  onOpenSheet: () => void;
  onPhaseChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onToChange: (value: string) => void;
  onTreatmentChange: (value: string) => void;
};

export default function PatientGalleryFilters({
  from,
  phase,
  phaseOptions,
  search,
  sort,
  to,
  treatmentId,
  treatmentOptions,
  onClearDates,
  onFromChange,
  onOpenSheet,
  onPhaseChange,
  onSearchChange,
  onSortChange,
  onToChange,
  onTreatmentChange,
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
        className="w-36 shrink-0"
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
        label={PATIENT_GALLERY_COPY.filterLabels.treatment}
        className="w-44 shrink-0"
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={treatmentId || null}
            onValueChange={(value) => onTreatmentChange(value ?? "")}
            options={treatmentOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.allTreatments}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.treatment}
            allowClear
            clearLabel={PATIENT_GALLERY_COPY.filters.allTreatments}
            variant="pill"
            className="w-full"
          />
        )}
      </FilterField>
      <FilterField
        label={PATIENT_GALLERY_COPY.filterLabels.date}
        className="w-44 shrink-0"
      >
        {({ controlId }) => (
          <PatientGalleryDateRangeFilter
            id={controlId}
            from={from}
            to={to}
            onFromChange={onFromChange}
            onToChange={onToChange}
            onClear={onClearDates}
          />
        )}
      </FilterField>
      <FilterField
        label={PATIENT_GALLERY_COPY.filterLabels.sort}
        className="w-36 shrink-0"
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
