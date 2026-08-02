"use client";

import { useState } from "react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import FiltersSheet from "@/components/ui/filters-sheet";

type TreatmentFilters = {
  category: string;
};

type TreatmentsFiltersSheetProps = {
  open: boolean;
  filters: TreatmentFilters;
  categoryOptions: Array<{ label: string; value: string }>;
  onApply: (updates: TreatmentFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function TreatmentsFiltersSheet({
  open,
  filters,
  categoryOptions,
  onApply,
  onClear,
  onDismiss,
}: TreatmentsFiltersSheetProps) {
  const [pending, setPending] = useState<TreatmentFilters>(filters);

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
      <FilterField
        variant="sheet"
        label={TREATMENTS_COPY.filterLabels.category}
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.category || null}
            onValueChange={(value) =>
              setPending((prev) => ({ ...prev, category: value ?? "" }))
            }
            options={categoryOptions}
            placeholder={TREATMENTS_COPY.page.allCategories}
            searchPlaceholder={TREATMENTS_COPY.form.category}
            allowClear
            clearLabel={TREATMENTS_COPY.page.allCategories}
          />
        )}
      </FilterField>
    </FiltersSheet>
  );
}
