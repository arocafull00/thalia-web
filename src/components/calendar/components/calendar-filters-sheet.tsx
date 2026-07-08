"use client";

import { Users } from "lucide-react";
import { useMemo, useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import FiltersSheet from "@/components/ui/filters-sheet";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { useEmployees } from "@/lib/hooks/use-employees";
import type { CalendarViewMode } from "@/stores/calendar-store";

export type CalendarFilters = {
  employeeId: string | null;
  viewMode: CalendarViewMode;
};

type CalendarFiltersSheetProps = {
  open: boolean;
  filters: CalendarFilters;
  onApply: (updates: CalendarFilters) => void;
  onClear: () => void;
  onDismiss: () => void;
  onToday: () => void;
};

export default function CalendarFiltersSheet({
  open,
  filters,
  onApply,
  onClear,
  onDismiss,
  onToday,
}: CalendarFiltersSheetProps) {
  const employees = useEmployees();
  const [pending, setPending] = useState<CalendarFilters>(filters);

  const activeEmployees = useMemo(
    () =>
      (employees.data ?? []).filter((employee) => employee.active !== false),
    [employees.data],
  );

  const employeeOptions = useMemo(
    () =>
      activeEmployees.map((employee) => ({
        value: employee.id,
        label: employee.full_name,
        leading: (
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${employee.color ? "" : "bg-border"}`}
            style={
              employee.color ? { backgroundColor: employee.color } : undefined
            }
          />
        ),
      })),
    [activeEmployees],
  );

  const handleApply = () => {
    onApply(pending);
    onDismiss();
  };

  const handleClear = () => {
    onClear();
    onDismiss();
  };

  const handleToday = () => {
    onToday();
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
          {CALENDAR_COPY.filters.view}
        </p>
        <div className="flex rounded-full border border-border bg-canvas p-0.5">
          <button
            type="button"
            onClick={() =>
              setPending((prev) => ({ ...prev, viewMode: "week" }))
            }
            className={`min-h-11 flex-1 rounded-full px-3 text-xs font-medium transition motion-reduce:transition-none ${
              pending.viewMode === "week"
                ? "bg-primary text-on-primary"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            {CALENDAR_COPY.toolbar.viewWeek}
          </button>
          <button
            type="button"
            onClick={() =>
              setPending((prev) => ({ ...prev, viewMode: "month" }))
            }
            className={`min-h-11 flex-1 rounded-full px-3 text-xs font-medium transition motion-reduce:transition-none ${
              pending.viewMode === "month"
                ? "bg-primary text-on-primary"
                : "text-ink-secondary hover:text-ink"
            }`}
          >
            {CALENDAR_COPY.toolbar.viewMonth}
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleToday}
        className="flex min-h-11 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
      >
        {CALENDAR_COPY.toolbar.today}
      </button>

      <div className="space-y-2">
        <p className="text-sm font-medium text-ink">
          {CALENDAR_COPY.filters.employee}
        </p>
        <AppSearchableCombobox
          value={pending.employeeId}
          onValueChange={(value) =>
            setPending((prev) => ({ ...prev, employeeId: value }))
          }
          options={employeeOptions}
          placeholder={CALENDAR_COPY.filters.all}
          searchPlaceholder={CALENDAR_COPY.filters.searchEmployee}
          allowClear
          clearLabel={CALENDAR_COPY.filters.all}
          variant="pill"
          triggerLeading={<Users size={16} />}
        />
      </div>
    </FiltersSheet>
  );
}
