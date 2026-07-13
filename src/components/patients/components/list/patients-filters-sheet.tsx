"use client";

import { useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
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
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {PATIENTS_COPY.filters.status}
        </p>
        <AppSearchableCombobox
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
      </div>
    </FiltersSheet>
  );
}
