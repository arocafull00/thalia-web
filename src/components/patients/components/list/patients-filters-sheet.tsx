"use client";

import { useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import FiltersSheet from "@/components/ui/filters-sheet";
import { PATIENTS_COPY } from "@/copy/patients-copy";

const statusOptions = [
  { label: PATIENTS_COPY.filters.active, value: "active" },
  { label: PATIENTS_COPY.filters.inactive, value: "inactive" },
];

type PatientFilters = {
  status: string;
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
      <FilterField variant="sheet" label={PATIENTS_COPY.filterLabels.status}>
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.status || null}
            onValueChange={(v) =>
              setPending((prev) => ({ ...prev, status: v ?? "" }))
            }
            options={statusOptions}
            placeholder={PATIENTS_COPY.filters.all}
            searchPlaceholder={PATIENTS_COPY.filters.status}
            allowClear
            clearLabel={PATIENTS_COPY.filters.all}
          />
        )}
      </FilterField>
    </FiltersSheet>
  );
}
