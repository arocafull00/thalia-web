"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import { SEARCH_COPY } from "@/copy/search-copy";
import type { EmployeeRole } from "@/types/database.types";

const roleOptions: Array<{ value: EmployeeRole; label: string }> = [
  { value: "admin", label: EMPLOYEES_COPY.roles.admin },
  { value: "reception", label: EMPLOYEES_COPY.roles.reception },
  { value: "doctor", label: EMPLOYEES_COPY.roles.doctor },
  { value: "auxiliary", label: EMPLOYEES_COPY.roles.auxiliary },
];

const statusOptions = [
  { label: EMPLOYEES_COPY.filters.active, value: "active" },
  { label: EMPLOYEES_COPY.filters.inactive, value: "inactive" },
];

type EmployeesFiltersProps = {
  role: string;
  search: string;
  status: string;
  onOpenSheet: () => void;
  onRoleChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export default function EmployeesFilters({
  role,
  search,
  status,
  onOpenSheet,
  onRoleChange,
  onSearchChange,
  onStatusChange,
}: EmployeesFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchLabel={EMPLOYEES_COPY.filterLabels.search}
      searchPlaceholder={SEARCH_COPY.placeholders["/employees"]}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      <FilterField label={EMPLOYEES_COPY.filterLabels.role} className="w-40">
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={role || null}
            onValueChange={(value) => onRoleChange(value ?? "")}
            options={roleOptions}
            placeholder={EMPLOYEES_COPY.roles.all}
            searchPlaceholder={EMPLOYEES_COPY.filters.role}
            allowClear
            clearLabel={EMPLOYEES_COPY.roles.all}
            variant="pill"
            className="w-full"
          />
        )}
      </FilterField>
      <FilterField label={EMPLOYEES_COPY.filterLabels.status} className="w-40">
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={status || null}
            onValueChange={(value) => onStatusChange(value ?? "")}
            options={statusOptions}
            placeholder={EMPLOYEES_COPY.filters.all}
            searchPlaceholder={EMPLOYEES_COPY.filters.status}
            allowClear
            clearLabel={EMPLOYEES_COPY.filters.all}
            variant="pill"
            className="w-full"
          />
        )}
      </FilterField>
    </PageFiltersBar>
  );
}
