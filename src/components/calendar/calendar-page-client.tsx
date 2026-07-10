"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import CalendarEmployeeFilter from "@/components/calendar/calendar-employee-filter";
import CalendarFiltersSheet from "@/components/calendar/components/calendar-filters-sheet";
import CalendarMobileDayView from "@/components/calendar/components/calendar-mobile-day-view";
import CalendarMobileMonthView from "@/components/calendar/components/calendar-mobile-month-view";
import CalendarToolbar from "@/components/calendar/components/calendar-toolbar";
import { useCalendarPage } from "@/components/calendar/hooks/use-calendar-page";
import { useSwipeNavigation } from "@/components/calendar/hooks/use-swipe-navigation";
import ScheduleXCalendar from "@/components/calendar/schedule-x-calendar";
import { ActionButton } from "@/components/ui/primitives/action-button";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { useIsMobile } from "@/hooks/use-mobile";
import type { CalendarViewMode } from "@/stores/calendar-store";
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

  useEffect(() => {
    if (isMobile && viewMode === "week") {
      onChangeViewMode("month");
    }
  }, [isMobile, onChangeViewMode, viewMode]);

  const handleOpenFiltersSheet = useCallback(() => {
    setSheetKey((key) => key + 1);
    setSheetOpen(true);
  }, []);

  const handleApplyFilters = useCallback(
    (updates: { employeeId: string | null; viewMode: CalendarViewMode }) => {
      setEmployeeId(updates.employeeId);
      const nextViewMode =
        isMobile && updates.viewMode === "week" ? "month" : updates.viewMode;
      if (nextViewMode !== viewMode) {
        onChangeViewMode(nextViewMode);
      }
    },
    [isMobile, onChangeViewMode, setEmployeeId, viewMode],
  );

  const handleClearFilters = useCallback(() => {
    setEmployeeId(CALENDAR_FILTER_DEFAULTS.employeeId);
    onChangeViewMode(isMobile ? "month" : CALENDAR_FILTER_DEFAULTS.viewMode);
  }, [isMobile, onChangeViewMode, setEmployeeId]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden">
      <div className="shrink-0 hidden lg:flex items-center justify-between border-border-subtle bg-canvas px-4 py-3 lg:px-8 lg:py-4">
        <h1 className="text-2xl font-medium text-ink">Calendario</h1>
        <ActionButton
          title={CALENDAR_COPY.toolbar.newAppointment}
          onClick={() => openCreateDialog()}
        />
      </div>
      <CalendarToolbar
        rangeLabel={rangeLabel}
        viewMode={viewMode}
        filter={<CalendarEmployeeFilter />}
        onPrevious={onPrevious}
        onNext={onNext}
        onToday={onToday}
        onChangeViewMode={onChangeViewMode}
        onOpenFiltersSheet={handleOpenFiltersSheet}
      />
      <div ref={calendarWrapperRef} className="min-h-0 flex-1 bg-surface">
        {isMobile && viewMode === "month" ? (
          <CalendarMobileMonthView />
        ) : isMobile && viewMode === "day" ? (
          <CalendarMobileDayView />
        ) : (
          <ScheduleXCalendar />
        )}
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
