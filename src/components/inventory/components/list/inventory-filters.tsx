"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { INVENTORY_COPY } from "@/copy/inventory-copy";
import { SEARCH_COPY } from "@/copy/search-copy";

const stockOptions = [
  { label: INVENTORY_COPY.filters.critical, value: "critical" },
  { label: INVENTORY_COPY.filters.low, value: "low" },
  { label: INVENTORY_COPY.filters.optimal, value: "ok" },
];

type InventoryFiltersProps = {
  category: string;
  categoryOptions: Array<{ label: string; value: string }>;
  search: string;
  stock: string;
  onCategoryChange: (value: string) => void;
  onOpenSheet: () => void;
  onSearchChange: (value: string) => void;
  onStockChange: (value: string) => void;
};

export default function InventoryFilters({
  category,
  categoryOptions,
  search,
  stock,
  onCategoryChange,
  onOpenSheet,
  onSearchChange,
  onStockChange,
}: InventoryFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchLabel={INVENTORY_COPY.filterLabels.search}
      searchPlaceholder={SEARCH_COPY.placeholders["/inventory"]}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      {categoryOptions.length > 0 ? (
        <FilterField
          label={INVENTORY_COPY.filterLabels.category}
          className="w-40"
        >
          {({ controlId }) => (
            <AppSearchableCombobox
              id={controlId}
              value={category || null}
              onValueChange={(value) => onCategoryChange(value ?? "")}
              options={categoryOptions}
              placeholder={INVENTORY_COPY.filters.all}
              searchPlaceholder={INVENTORY_COPY.filters.category}
              allowClear
              clearLabel={INVENTORY_COPY.filters.all}
              variant="pill"
              className="w-full"
            />
          )}
        </FilterField>
      ) : null}
      <FilterField label={INVENTORY_COPY.filterLabels.stock} className="w-40">
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={stock || null}
            onValueChange={(value) => onStockChange(value ?? "")}
            options={stockOptions}
            placeholder={INVENTORY_COPY.filters.all}
            searchPlaceholder={INVENTORY_COPY.filters.stock}
            allowClear
            clearLabel={INVENTORY_COPY.filters.all}
            variant="pill"
            className="w-full"
          />
        )}
      </FilterField>
    </PageFiltersBar>
  );
}
