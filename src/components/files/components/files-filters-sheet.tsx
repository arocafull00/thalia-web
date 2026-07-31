"use client";

import { useState } from "react";

import AppDateField from "@/components/ui/app-date-field";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FiltersSheet from "@/components/ui/filters-sheet";
import { FILES_COPY } from "@/copy/files-copy";
import { PATIENT_FILE_CATEGORY_OPTIONS } from "@/copy/patient-files-copy";
import {
  formatLocalDateInputValue,
  parseLocalDateInputValue,
} from "@/lib/date-input";
import type { FilesFilters } from "@/lib/hooks/use-files-page";

const sortOptions = Object.entries(FILES_COPY.sort).map(([value, label]) => ({
  value,
  label,
}));

function parseDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? parseLocalDateInputValue(value)
    : null;
}

type FilesFiltersSheetProps = {
  open: boolean;
  filters: FilesFilters;
  onApply: (updates: FilesFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
};

export default function FilesFiltersSheet({
  open,
  filters,
  onApply,
  onClear,
  onDismiss,
}: FilesFiltersSheetProps) {
  const [pending, setPending] = useState<FilesFilters>(filters);
  const pendingFrom = parseDate(pending.from);
  const pendingTo = parseDate(pending.to);

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
      contentClassName="min-h-[72dvh]"
    >
      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {FILES_COPY.filters.category}
        </p>
        <AppSearchableCombobox
          value={pending.category || null}
          onValueChange={(value) =>
            setPending((current) => ({
              ...current,
              category: value ?? "",
            }))
          }
          options={PATIENT_FILE_CATEGORY_OPTIONS}
          placeholder={FILES_COPY.filters.allCategories}
          searchPlaceholder={FILES_COPY.filters.category}
          clearLabel={FILES_COPY.filters.allCategories}
          allowClear
          showSearch={false}
        />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-ink">
          {FILES_COPY.filters.date}
        </p>
        <label className="block space-y-1.5 text-sm text-ink-secondary">
          <span>{FILES_COPY.filters.dateFrom}</span>
          <AppDateField
            value={pendingFrom}
            onChange={(value) =>
              setPending((current) => ({
                ...current,
                from: formatLocalDateInputValue(value),
              }))
            }
            maxDate={pendingTo ?? undefined}
          />
        </label>
        <label className="block space-y-1.5 text-sm text-ink-secondary">
          <span>{FILES_COPY.filters.dateTo}</span>
          <AppDateField
            value={pendingTo}
            onChange={(value) =>
              setPending((current) => ({
                ...current,
                to: formatLocalDateInputValue(value),
              }))
            }
            minDate={pendingFrom ?? undefined}
          />
        </label>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {FILES_COPY.filters.sort}
        </p>
        <AppSearchableCombobox
          value={pending.sort}
          onValueChange={(value) =>
            setPending((current) => ({
              ...current,
              sort: value ?? "newest",
            }))
          }
          options={sortOptions}
          placeholder={FILES_COPY.filters.sort}
          searchPlaceholder={FILES_COPY.filters.sort}
          showSearch={false}
        />
      </div>
    </FiltersSheet>
  );
}
