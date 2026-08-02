"use client";

import { useState } from "react";

import CampaignsDateRangeFilter from "@/components/marketing/components/list/campaigns-date-range-filter";
import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FilterField from "@/components/ui/filter-field";
import FiltersSheet from "@/components/ui/filters-sheet";
import { CAMPAIGN_STATUS_VALUES } from "@/lib/hooks/use-marketing-page";

const { filters, status: statusCopy } = MARKETING_COPY;

const statusOptions = CAMPAIGN_STATUS_VALUES.map((value) => ({
  label: statusCopy[value],
  value,
}));

type CampaignsSheetFilters = {
  status: string;
  from: string;
  to: string;
};

type CampaignsFiltersSheetProps = {
  open: boolean;
  filters: CampaignsSheetFilters;
  onApply: (updates: CampaignsSheetFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function CampaignsFiltersSheet({
  open,
  filters: current,
  onApply,
  onClear,
  onDismiss,
}: CampaignsFiltersSheetProps) {
  const [pending, setPending] = useState<CampaignsSheetFilters>(current);

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
      <FilterField variant="sheet" label={MARKETING_COPY.filterLabels.status}>
        {({ controlId }) => (
          <AppSearchableCombobox
            id={controlId}
            value={pending.status || null}
            onValueChange={(value) =>
              setPending((prev) => ({ ...prev, status: value ?? "" }))
            }
            options={statusOptions}
            placeholder={filters.all}
            searchPlaceholder={filters.status}
            allowClear
            clearLabel={filters.all}
            className="w-full"
          />
        )}
      </FilterField>
      <FilterField variant="sheet" label={MARKETING_COPY.filterLabels.date}>
        {({ controlId }) => (
          <CampaignsDateRangeFilter
            id={controlId}
            from={pending.from}
            to={pending.to}
            onFromChange={(value) =>
              setPending((prev) => ({ ...prev, from: value }))
            }
            onToChange={(value) =>
              setPending((prev) => ({ ...prev, to: value }))
            }
            onClear={() =>
              setPending((prev) => ({ ...prev, from: "", to: "" }))
            }
          />
        )}
      </FilterField>
    </FiltersSheet>
  );
}
