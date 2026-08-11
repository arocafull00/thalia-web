"use client";

import { useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import FiltersSheet from "@/components/ui/filters-sheet";
import { PATIENTS_COPY } from "@/copy/patients-copy";

const marketingOptions = [
  { label: PATIENTS_COPY.filters.granted, value: "granted" },
  { label: PATIENTS_COPY.filters.denied, value: "denied" },
];

type PatientFilters = {
  marketing: string;
};

type PatientsFiltersSheetProps = {
  open: boolean;
  filters: PatientFilters;
  onApply: (updates: PatientFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function PatientsFiltersSheet({
  open,
  filters,
  onApply,
  onClear,
  onDismiss,
}: PatientsFiltersSheetProps) {
  const [pending, setPending] = useState<PatientFilters>(filters);

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
      <FilterField variant="sheet" label={PATIENTS_COPY.filterLabels.marketing}>
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.marketing || null}
            onValueChange={(v) =>
              setPending((prev) => ({ ...prev, marketing: v ?? "" }))
            }
            options={marketingOptions}
            placeholder={PATIENTS_COPY.filters.all}
            searchPlaceholder={PATIENTS_COPY.filters.marketing}
            allowClear
            clearLabel={PATIENTS_COPY.filters.all}
          />
        )}
      </FilterField>
    </FiltersSheet>
  );
}
