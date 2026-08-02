"use client";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { SEARCH_COPY } from "@/copy/search-copy";

type TreatmentsFiltersProps = {
  category: string;
  categoryOptions: Array<{ label: string; value: string }>;
  search: string;
  showCategoryFilter: boolean;
  onCategoryChange: (value: string) => void;
  onOpenSheet: () => void;
  onSearchChange: (value: string) => void;
};

export default function TreatmentsFilters({
  category,
  categoryOptions,
  search,
  showCategoryFilter,
  onCategoryChange,
  onOpenSheet,
  onSearchChange,
}: TreatmentsFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchLabel={TREATMENTS_COPY.filterLabels.search}
      searchPlaceholder={SEARCH_COPY.placeholders["/treatments"]}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
      showMobileSheetButton={showCategoryFilter}
    >
      {showCategoryFilter ? (
        <FilterField
          label={TREATMENTS_COPY.filterLabels.category}
          className="w-40"
        >
          {({ controlId }) => (
            <AppSearchableCombobox
              id={controlId}
              value={category || null}
              onValueChange={(value) => onCategoryChange(value ?? "")}
              options={categoryOptions}
              placeholder={TREATMENTS_COPY.page.allCategories}
              searchPlaceholder={TREATMENTS_COPY.form.category}
              allowClear
              clearLabel={TREATMENTS_COPY.page.allCategories}
              variant="pill"
              className="w-full"
            />
          )}
        </FilterField>
      ) : null}
    </PageFiltersBar>
  );
}
