"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { SEARCH_COPY } from "@/copy/search-copy";

type FinancesFiltersProps = {
  category: string;
  categoryOptions: Array<{ label: string; value: string }>;
  search: string;
  onCategoryChange: (value: string) => void;
  onOpenSheet: () => void;
  onSearchChange: (value: string) => void;
};

export default function FinancesFilters({
  category,
  categoryOptions,
  search,
  onCategoryChange,
  onOpenSheet,
  onSearchChange,
}: FinancesFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchLabel={FINANCES_COPY.filterLabels.search}
      searchPlaceholder={SEARCH_COPY.placeholders["/finances"]}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
      showMobileSheetButton={categoryOptions.length > 0}
    >
      {categoryOptions.length > 0 ? (
        <FilterField
          label={FINANCES_COPY.filterLabels.category}
          className="w-40"
        >
          {({ controlId }) => (
            <AppSearchableCombobox
              id={controlId}
              value={category || null}
              onValueChange={(value) => onCategoryChange(value ?? "")}
              options={categoryOptions}
              placeholder={FINANCES_COPY.filters.all}
              searchPlaceholder={FINANCES_COPY.filters.category}
              allowClear
              clearLabel={FINANCES_COPY.filters.all}
              variant="pill"
              className="w-full"
            />
          )}
        </FilterField>
      ) : null}
    </PageFiltersBar>
  );
}
