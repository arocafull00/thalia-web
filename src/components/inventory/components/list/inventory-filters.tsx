"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
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
      searchPlaceholder={SEARCH_COPY.placeholders["/inventory"]}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      {categoryOptions.length > 0 ? (
        <div className="w-40 min-w-0">
          <AppSearchableCombobox
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
        </div>
      ) : null}
      <div className="w-40 min-w-0">
        <AppSearchableCombobox
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
      </div>
    </PageFiltersBar>
  );
}
