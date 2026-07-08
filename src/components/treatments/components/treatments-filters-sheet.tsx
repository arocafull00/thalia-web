"use client";

import { useState } from "react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
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
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {TREATMENTS_COPY.form.category}
        </p>
        <AppSearchableCombobox
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
      </div>
    </FiltersSheet>
  );
}
