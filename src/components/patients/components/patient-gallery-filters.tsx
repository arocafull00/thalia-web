"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { PATIENT_GALLERY_COPY } from "@/copy/patient-gallery-copy";

const sortOptions = [
  { label: PATIENT_GALLERY_COPY.filters.sortRecent, value: "recent" },
  { label: PATIENT_GALLERY_COPY.filters.sortOldest, value: "oldest" },
];

type PatientGalleryFiltersProps = {
  category: string;
  categoryOptions: Array<{ label: string; value: string }>;
  search: string;
  sort: string;
  onCategoryChange: (value: string) => void;
  onOpenSheet: () => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
};

export default function PatientGalleryFilters({
  category,
  categoryOptions,
  search,
  sort,
  onCategoryChange,
  onOpenSheet,
  onSearchChange,
  onSortChange,
}: PatientGalleryFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchPlaceholder={PATIENT_GALLERY_COPY.filters.search}
      searchClearLabel={PATIENT_GALLERY_COPY.filters.searchClear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      {categoryOptions.length > 0 ? (
        <div className="w-40 min-w-0">
          <AppSearchableCombobox
            value={category || null}
            onValueChange={(value) => onCategoryChange(value ?? "")}
            options={categoryOptions}
            placeholder={PATIENT_GALLERY_COPY.filters.all}
            searchPlaceholder={PATIENT_GALLERY_COPY.filters.category}
            allowClear
            clearLabel={PATIENT_GALLERY_COPY.filters.all}
            variant="pill"
            className="w-full"
          />
        </div>
      ) : null}
      <div className="w-40 min-w-0">
        <AppSearchableCombobox
          value={sort || null}
          onValueChange={(value) => onSortChange(value ?? "recent")}
          options={sortOptions}
          placeholder={PATIENT_GALLERY_COPY.filters.sortRecent}
          searchPlaceholder={PATIENT_GALLERY_COPY.filters.sort}
          variant="pill"
          className="w-full"
        />
      </div>
    </PageFiltersBar>
  );
}
