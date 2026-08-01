"use client";

import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, ChevronDown } from "lucide-react";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import AppDateField from "@/components/ui/app-date-field";
import { Button } from "@/components/ui/button";
import {
  formatLocalDateInputValue,
  parseLocalDateInputValue,
} from "@/lib/date-input";

const { filters } = MARKETING_COPY;

type CampaignsDateRangeFilterProps = {
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
  const short = (value: Date) =>
    format(value, "dd MMM", { locale: es }).replace(".", "");

  if (fromDate && toDate) {
    return `${short(fromDate)} – ${short(toDate)}`;
  }

  if (fromDate) {
    return `${filters.dateFrom} ${short(fromDate)}`;
  }

  if (toDate) {
    return `${filters.dateTo} ${short(toDate)}`;
  }

  return filters.anyDate;
}

export default function CampaignsDateRangeFilter({
  from,
  to,
  onFromChange,
  onToChange,
  onClear,
}: CampaignsDateRangeFilterProps) {
  const fromDate = parseDate(from);
  const toDate = parseDate(to);

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <Button
          type="button"
          variant="outline"
          data-testid="campaigns-date-filter"
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
              <span>{filters.dateFrom}</span>
              <AppDateField
                value={fromDate}
                onChange={(value) =>
                  onFromChange(formatLocalDateInputValue(value))
                }
                maxDate={toDate ?? undefined}
              />
            </label>
            <label className="block space-y-1.5 text-sm text-ink-secondary">
              <span>{filters.dateTo}</span>
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
                {filters.clearDate}
              </Button>
            ) : null}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
