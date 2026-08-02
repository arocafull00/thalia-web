"use client";

import { useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import FiltersSheet from "@/components/ui/filters-sheet";
import { FINANCES_COPY } from "@/copy/finances-copy";

type FinancesFilters = {
  category: string;
};

type FinancesFiltersSheetProps = {
  open: boolean;
  filters: FinancesFilters;
  categoryOptions: Array<{ label: string; value: string }>;
  onApply: (updates: FinancesFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function FinancesFiltersSheet({
  open,
  filters,
  categoryOptions,
  onApply,
  onClear,
  onDismiss,
}: FinancesFiltersSheetProps) {
  const [pending, setPending] = useState<FinancesFilters>(filters);

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
      <FilterField variant="sheet" label={FINANCES_COPY.filterLabels.category}>
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.category || null}
            onValueChange={(v) =>
              setPending((prev) => ({ ...prev, category: v ?? "" }))
            }
            options={categoryOptions}
            placeholder={FINANCES_COPY.filters.all}
            searchPlaceholder={FINANCES_COPY.filters.category}
            allowClear
            clearLabel={FINANCES_COPY.filters.all}
          />
        )}
      </FilterField>
    </FiltersSheet>
  );
}
