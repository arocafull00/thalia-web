"use client";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { SEARCH_COPY } from "@/copy/search-copy";

// Filtra la columna `marketing_opt_in`: sin consentimiento el paciente no
// entra en ninguna campaña, así que interesa poder aislar unos y otros.
const marketingOptions = [
  { label: PATIENTS_COPY.filters.granted, value: "granted" },
  { label: PATIENTS_COPY.filters.denied, value: "denied" },
];

type PatientsFiltersProps = {
  search: string;
  marketing: string;
  onOpenSheet: () => void;
  onSearchChange: (value: string) => void;
  onMarketingChange: (value: string) => void;
};

export default function PatientsFilters({
  search,
  marketing,
  onOpenSheet,
  onSearchChange,
  onMarketingChange,
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
      <FilterField
        label={PATIENTS_COPY.filterLabels.marketing}
        className="w-40"
      >
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            testId="patients-marketing-combobox"
            value={marketing || null}
            onValueChange={(value) => onMarketingChange(value ?? "")}
            options={marketingOptions}
            placeholder={PATIENTS_COPY.filters.all}
            searchPlaceholder={PATIENTS_COPY.filters.marketing}
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
