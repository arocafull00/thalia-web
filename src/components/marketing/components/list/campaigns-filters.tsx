"use client";

import CampaignsDateRangeFilter from "@/components/marketing/components/list/campaigns-date-range-filter";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import PageFiltersBar from "@/components/ui/page-filters-bar";
import { SEARCH_COPY } from "@/copy/search-copy";
import { CAMPAIGN_STATUS_VALUES } from "@/lib/hooks/use-marketing-page";

const { filters, status: statusCopy } = MARKETING_COPY;

const statusOptions = CAMPAIGN_STATUS_VALUES.map((value) => ({
  label: statusCopy[value],
  value,
}));

type CampaignsFiltersProps = {
  search: string;
  status: string;
  from: string;
  to: string;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClearDates: () => void;
  onOpenSheet: () => void;
};

export default function CampaignsFilters({
  search,
  status,
  from,
  to,
  onSearchChange,
  onStatusChange,
  onFromChange,
  onToChange,
  onClearDates,
  onOpenSheet,
}: CampaignsFiltersProps) {
  return (
    <PageFiltersBar
      search={search}
      searchPlaceholder={SEARCH_COPY.placeholders["/marketing"]}
      searchClearLabel={SEARCH_COPY.clear}
      onSearchChange={onSearchChange}
      onOpenSheet={onOpenSheet}
    >
      <div className="w-40 min-w-0">
        <AppSearchableCombobox
          value={status || null}
          onValueChange={(value) => onStatusChange(value ?? "")}
          options={statusOptions}
          placeholder={filters.all}
          searchPlaceholder={filters.status}
          allowClear
          clearLabel={filters.all}
          variant="pill"
          className="w-full"
          testId="campaigns-status-combobox"
        />
      </div>
      <div className="w-48 min-w-0">
        <CampaignsDateRangeFilter
          from={from}
          to={to}
          onFromChange={onFromChange}
          onToChange={onToChange}
          onClear={onClearDates}
        />
      </div>
    </PageFiltersBar>
  );
}
