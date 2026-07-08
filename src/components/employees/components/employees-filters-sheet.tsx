"use client";

import { useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FiltersSheet from "@/components/ui/filters-sheet";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import type { EmployeeRole } from "@/types/database.types";

const roleOptions: Array<{ label: string; value: EmployeeRole }> = [
  { value: "admin", label: EMPLOYEES_COPY.roles.admin },
  { value: "reception", label: EMPLOYEES_COPY.roles.reception },
  { value: "doctor", label: EMPLOYEES_COPY.roles.doctor },
  { value: "auxiliary", label: EMPLOYEES_COPY.roles.auxiliary },
];

const statusOptions = [
  { label: EMPLOYEES_COPY.filters.active, value: "active" },
  { label: EMPLOYEES_COPY.filters.inactive, value: "inactive" },
];

type EmployeeFilters = {
  role: string;
  status: string;
};

type EmployeesFiltersSheetProps = {
  open: boolean;
  filters: EmployeeFilters;
  onApply: (updates: EmployeeFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function EmployeesFiltersSheet({
  open,
  filters,
  onApply,
  onClear,
  onDismiss,
}: EmployeesFiltersSheetProps) {
  const [pending, setPending] = useState<EmployeeFilters>(filters);

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
          {EMPLOYEES_COPY.filters.role}
        </p>
        <AppSearchableCombobox
          value={pending.role || null}
          onValueChange={(v) =>
            setPending((prev) => ({ ...prev, role: v ?? "" }))
          }
          options={roleOptions}
          placeholder={EMPLOYEES_COPY.roles.all}
          searchPlaceholder={EMPLOYEES_COPY.filters.role}
          allowClear
          clearLabel={EMPLOYEES_COPY.roles.all}
        />
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {EMPLOYEES_COPY.filters.status}
        </p>
        <AppSearchableCombobox
          value={pending.status || null}
          onValueChange={(v) =>
            setPending((prev) => ({ ...prev, status: v ?? "" }))
          }
          options={statusOptions}
          placeholder={EMPLOYEES_COPY.filters.all}
          searchPlaceholder={EMPLOYEES_COPY.filters.status}
          allowClear
          clearLabel={EMPLOYEES_COPY.filters.all}
        />
      </div>
    </FiltersSheet>
  );
}
