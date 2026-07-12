"use client";

import { Users } from "lucide-react";
import { useMemo, useState } from "react";

import CalendarViewModeToggle from "@/components/calendar/components/calendar-view-mode-toggle";
import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { Button } from "@/components/ui/button";
import FiltersSheet from "@/components/ui/filters-sheet";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEmployees } from "@/lib/hooks/use-employees";
import type { CalendarViewMode } from "@/stores/calendar-store";

const MOBILE_VIEW_MODES: CalendarViewMode[] = ["day", "month"];

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
  const isMobile = useIsMobile();
  const employees = useEmployees();
  const [pending, setPending] = useState<CalendarFilters>(filters);
  const viewModes = isMobile ? MOBILE_VIEW_MODES : undefined;

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
        <CalendarViewModeToggle
          viewMode={pending.viewMode}
          modes={viewModes}
          fullWidth
          onChange={(viewMode) => setPending((prev) => ({ ...prev, viewMode }))}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleToday}
        className="min-h-11 w-full rounded-full text-sm font-medium motion-reduce:transition-none"
      >
        {CALENDAR_COPY.toolbar.today}
      </Button>

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
