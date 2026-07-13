"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
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
      searchPlaceholder={SEARCH_COPY.placeholders["/employees"]}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      <div className="w-40 min-w-0">
        <AppSearchableCombobox
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
      </div>
      <div className="w-40 min-w-0">
        <AppSearchableCombobox
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
      </div>
    </PageFiltersBar>
  );
}
