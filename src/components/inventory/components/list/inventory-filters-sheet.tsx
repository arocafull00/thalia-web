"use client";

import { useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import FiltersSheet from "@/components/ui/filters-sheet";
import { INVENTORY_COPY } from "@/copy/inventory-copy";

const stockOptions = [
  { label: INVENTORY_COPY.filters.critical, value: "critical" },
  { label: INVENTORY_COPY.filters.low, value: "low" },
  { label: INVENTORY_COPY.filters.optimal, value: "ok" },
];

type InventoryFilters = {
  category: string;
  stock: string;
};

type InventoryFiltersSheetProps = {
  open: boolean;
  filters: InventoryFilters;
  categoryOptions: Array<{ label: string; value: string }>;
  onApply: (updates: InventoryFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function InventoryFiltersSheet({
  open,
  filters,
  categoryOptions,
  onApply,
  onClear,
  onDismiss,
}: InventoryFiltersSheetProps) {
  const [pending, setPending] = useState<InventoryFilters>(filters);

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
        <FilterField
          variant="sheet"
          label={INVENTORY_COPY.filterLabels.category}
        >
          {({ controlId }) => (
            <AppSearchableCombobox
              id={controlId}
              value={pending.category || null}
              onValueChange={(v) =>
                setPending((prev) => ({ ...prev, category: v ?? "" }))
              }
              options={categoryOptions}
              placeholder={INVENTORY_COPY.filters.all}
              searchPlaceholder={INVENTORY_COPY.filters.category}
              allowClear
              clearLabel={INVENTORY_COPY.filters.all}
            />
          )}
        </FilterField>
      ) : null}
      <FilterField variant="sheet" label={INVENTORY_COPY.filterLabels.stock}>
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.stock || null}
            onValueChange={(v) =>
              setPending((prev) => ({ ...prev, stock: v ?? "" }))
            }
            options={stockOptions}
            placeholder={INVENTORY_COPY.filters.all}
            searchPlaceholder={INVENTORY_COPY.filters.stock}
            allowClear
            clearLabel={INVENTORY_COPY.filters.all}
          />
        )}
      </FilterField>
    </FiltersSheet>
  );
}
