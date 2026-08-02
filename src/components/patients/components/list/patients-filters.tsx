"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { SEARCH_COPY } from "@/copy/search-copy";

const statusOptions = [
  { label: PATIENTS_COPY.filters.active, value: "active" },
  { label: PATIENTS_COPY.filters.inactive, value: "inactive" },
];

type PatientsFiltersProps = {
  search: string;
  status: string;
  onOpenSheet: () => void;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
};

export default function PatientsFilters({
  search,
  status,
  onOpenSheet,
  onSearchChange,
  onStatusChange,
}: PatientsFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchLabel={PATIENTS_COPY.filterLabels.search}
      searchPlaceholder={SEARCH_COPY.placeholders["/patients"]}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      <FilterField label={PATIENTS_COPY.filterLabels.status} className="w-40">
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            testId="patients-status-combobox"
            value={status || null}
            onValueChange={(value) => onStatusChange(value ?? "")}
            options={statusOptions}
            placeholder={PATIENTS_COPY.filters.all}
            searchPlaceholder={PATIENTS_COPY.filters.status}
            allowClear
            clearLabel={PATIENTS_COPY.filters.all}
            variant="pill"
            className="w-full"
          />
        )}
      </FilterField>
    </PageFiltersBar>
  );
}
