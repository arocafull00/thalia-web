"use client";

import { useCallback, useRef, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import CalendarEmployeeFilter from "@/components/calendar/calendar-employee-filter";
import CalendarFiltersSheet from "@/components/calendar/components/calendar-filters-sheet";
import CalendarToolbar from "@/components/calendar/components/calendar-toolbar";
import { useCalendarPage } from "@/components/calendar/hooks/use-calendar-page";
import { useSwipeNavigation } from "@/components/calendar/hooks/use-swipe-navigation";
import ScheduleXCalendar from "@/components/calendar/schedule-x-calendar";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalendarStore } from "@/stores/calendar-store";

const CALENDAR_FILTER_DEFAULTS = {
  employeeId: null,
  viewMode: "week" as const,
};

export default function CalendarPageClient() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const isMobile = useIsMobile();
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);
  const {
    rangeLabel,
    viewMode,
    dialogOpen,
    createStartsAt,
    openCreateDialog,
    closeDialog,
    onPrevious,
    onNext,
    onToday,
    onChangeViewMode,
  } = useCalendarPage();

  useSwipeNavigation(calendarWrapperRef, {
    enabled: isMobile,
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
  });

  const handleOpenFiltersSheet = useCallback(() => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  }, []);

  const handleApplyFilters = useCallback(
    (updates: { employeeId: string | null; viewMode: "week" | "month" }) => {
      setEmployeeId(updates.employeeId);
      if (updates.viewMode !== viewMode) {
        onChangeViewMode(updates.viewMode);
      }
    },
    [onChangeViewMode, setEmployeeId, viewMode],
  );

  const handleClearFilters = useCallback(() => {
    setEmployeeId(CALENDAR_FILTER_DEFAULTS.employeeId);
    onChangeViewMode(CALENDAR_FILTER_DEFAULTS.viewMode);
  }, [onChangeViewMode, setEmployeeId]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <CalendarToolbar
        rangeLabel={rangeLabel}
        viewMode={viewMode}
        filter={<CalendarEmployeeFilter />}
        onPrevious={onPrevious}
        onNext={onNext}
        onToday={onToday}
        onNewAppointment={() => openCreateDialog()}
        onChangeViewMode={onChangeViewMode}
        onOpenFiltersSheet={handleOpenFiltersSheet}
      />
      <div ref={calendarWrapperRef} className="min-h-0 flex-1 bg-surface">
        <ScheduleXCalendar />
      </div>
      <AppointmentCreateDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
        initialStartsAt={createStartsAt}
      />
      <CalendarFiltersSheet
        key={sheetKey}
        open={sheetOpen}
        filters={{ employeeId, viewMode }}
        onApply={handleApplyFilters}
        onClear={handleClearFilters}
        onDismiss={() => setSheetOpen(false)}
        onToday={onToday}
      />
      <MobileFab
        label={CALENDAR_COPY.toolbar.newAppointment}
        onClick={() => openCreateDialog()}
      />
    </div>
  );
}
