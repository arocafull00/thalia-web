"use client";

import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, ChevronDown } from "lucide-react";

import AppDateField from "@/components/ui/app-date-field";
import { Button } from "@/components/ui/button";
import { FILES_COPY } from "@/copy/files-copy";
import {
  formatLocalDateInputValue,
  parseLocalDateInputValue,
} from "@/lib/date-input";

type FilesDateRangeFilterProps = {
  from: string;
  to: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  onClear: () => void;
};

function parseDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? parseLocalDateInputValue(value)
    : null;
}

function formatRangeLabel(from: string, to: string) {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  if (fromDate && toDate) {
    const fromLabel = format(fromDate, "dd MMM", { locale: es }).replace(
      ".",
      "",
    );
    const toLabel = format(toDate, "dd MMM", { locale: es }).replace(".", "");
    return `${fromLabel} – ${toLabel}`;
  }

  if (fromDate) {
    return `${FILES_COPY.filters.dateFrom} ${format(fromDate, "dd MMM", { locale: es })}`;
  }

  if (toDate) {
    return `${FILES_COPY.filters.dateTo} ${format(toDate, "dd MMM", { locale: es })}`;
  }

  return FILES_COPY.filters.anyDate;
}

export default function FilesDateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
  onClear,
}: FilesDateRangeFilterProps) {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-between rounded-full px-3 text-ink-secondary"
        >
          <span className="flex min-w-0 items-center gap-2">
            <CalendarDays aria-hidden="true" />
            <span className="truncate">{formatRangeLabel(from, to)}</span>
          </span>
          <ChevronDown className="text-ink-muted" aria-hidden="true" />
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="pointer-events-auto z-100 w-72 rounded-[14px] border border-border/60 bg-surface p-3 shadow-float"
        >
          <div className="space-y-3">
            <label className="block space-y-1.5 text-sm text-ink-secondary">
              <span>{FILES_COPY.filters.dateFrom}</span>
              <AppDateField
                value={fromDate}
                onChange={(value) =>
                  onFromChange(formatLocalDateInputValue(value))
                }
                maxDate={toDate ?? undefined}
              />
            </label>
            <label className="block space-y-1.5 text-sm text-ink-secondary">
              <span>{FILES_COPY.filters.dateTo}</span>
              <AppDateField
                value={toDate}
                onChange={(value) =>
                  onToChange(formatLocalDateInputValue(value))
                }
                minDate={fromDate ?? undefined}
              />
            </label>
            {from || to ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={onClear}
              >
                {FILES_COPY.filters.clearDate}
              </Button>
            ) : null}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
