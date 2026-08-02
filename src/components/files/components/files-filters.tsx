"use client";

import FilesDateRangeFilter from "@/components/files/components/files-date-range-filter";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { FILES_COPY } from "@/copy/files-copy";
import { PATIENT_FILE_CATEGORY_OPTIONS } from "@/copy/patient-files-copy";
import { SEARCH_COPY } from "@/copy/search-copy";

const categoryOptions = PATIENT_FILE_CATEGORY_OPTIONS.map((option) => ({
  value: option.value,
  label: option.label,
}));

const sortOptions = Object.entries(FILES_COPY.sort).map(([value, label]) => ({
  value,
  label,
}));

type FilesFiltersProps = {
  search: string;
  category: string;
  from: string;
  to: string;
  sort: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onOpenSheet: () => void;
  onClearDates: () => void;
};

export default function FilesFilters({
  search,
  category,
  from,
  to,
  sort,
  onSearchChange,
  onCategoryChange,
  onFromChange,
  onToChange,
  onSortChange,
  onOpenSheet,
  onClearDates,
}: FilesFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchLabel={FILES_COPY.filterLabels.search}
      searchPlaceholder={FILES_COPY.filters.patientSearch}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      <FilterField label={FILES_COPY.filterLabels.category} className="w-48">
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={category || null}
            onValueChange={(value) => onCategoryChange(value ?? "")}
            options={categoryOptions}
            placeholder={FILES_COPY.filters.allCategories}
            searchPlaceholder={FILES_COPY.filters.category}
            clearLabel={FILES_COPY.filters.allCategories}
            allowClear
            showSearch={false}
            variant="pill"
          />
        )}
      </FilterField>
      <FilterField label={FILES_COPY.filterLabels.date} className="w-48">
        {({ controlId }) => (
          <FilesDateRangeFilter
            id={controlId}
            from={from}
            to={to}
            onFromChange={onFromChange}
            onToChange={onToChange}
            onClear={onClearDates}
          />
        )}
      </FilterField>
      <FilterField label={FILES_COPY.filterLabels.sort} className="w-40">
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={sort}
            onValueChange={(value) => onSortChange(value ?? "newest")}
            options={sortOptions}
            placeholder={FILES_COPY.filters.sort}
            searchPlaceholder={FILES_COPY.filters.sort}
            showSearch={false}
            variant="pill"
          />
        )}
      </FilterField>
    </PageFiltersBar>
  );
}
