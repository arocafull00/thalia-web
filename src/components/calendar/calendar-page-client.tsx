"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import AppointmentCreateDialog from "@/components/appointments/components/appointment-create-dialog";
import CalendarEmployeeFilter from "@/components/calendar/calendar-employee-filter";
import {
  calendarWeekUiRefs,
  updateCalendarWeekUiRefs,
} from "@/components/calendar/calendar-week-ui-refs";
import CalendarFiltersSheet from "@/components/calendar/components/calendar-filters-sheet";
import CalendarMobileDayView from "@/components/calendar/components/calendar-mobile-day-view";
import CalendarMobileMonthView from "@/components/calendar/components/calendar-mobile-month-view";
import CalendarOverlapGroupSheet, {
  type CalendarOverlapGroupSheetState,
} from "@/components/calendar/components/calendar-overlap-group-sheet";
import CalendarToolbar from "@/components/calendar/components/calendar-toolbar";
import ClinicStatusBadge from "@/components/calendar/components/clinic-status-badge";
import { useCalendarPage } from "@/components/calendar/hooks/use-calendar-page";
import { useSwipeNavigation } from "@/components/calendar/hooks/use-swipe-navigation";
import ScheduleXCalendar from "@/components/calendar/schedule-x-calendar";
import { MobileFab } from "@/components/ui/primitives/mobile-fab";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAppointment } from "@/lib/hooks/use-appointments";
import { useClinicInfo } from "@/lib/hooks/use-clinic-info";
import { useTopbarAction } from "@/lib/hooks/use-topbar-action";
import type { CalendarViewMode } from "@/stores/calendar-store";
import { useCalendarStore } from "@/stores/calendar-store";

const CALENDAR_FILTER_DEFAULTS = {
  employeeId: null,
  viewMode: "week" as const,
};

const CLOSED_GROUP_SHEET: CalendarOverlapGroupSheetState = {
  open: false,
  title: "",
  subtitle: "",
  appointments: [],
};

export default function CalendarPageClient() {
  const router = useRouter();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [sheetKey, setSheetKey] = useState(0);
  const [groupSheet, setGroupSheet] =
    useState<CalendarOverlapGroupSheetState>(CLOSED_GROUP_SHEET);
  const isMobile = useIsMobile();
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);
  const setWeekAnchor = useCalendarStore((state) => state.setWeekAnchor);
  const setViewMode = useCalendarStore((state) => state.setViewMode);
  const openEditDialog = useCalendarStore((state) => state.openEditDialog);
  const {
    rangeLabel,
    viewMode,
    dialogOpen,
    createStartsAt,
    editingAppointmentId,
    openCreateDialog,
    closeDialog,
    onPrevious,
    onNext,
    onToday,
    onChangeViewMode,
  } = useCalendarPage();
  const editingAppointment = useAppointment(editingAppointmentId ?? "");
  const { clinic } = useClinicInfo();
  const isLoadingAppointment =
    Boolean(editingAppointmentId) && !editingAppointment.data;

  const handleOpenGroupSheet = useCallback((groupId: string) => {
    const appointments = calendarWeekUiRefs.groupAppointmentsById.get(groupId);
    if (!appointments || appointments.length === 0) {
      return;
    }

    const sortedAppointments = [...appointments].sort(
      (left, right) =>
        new Date(left.starts_at).getTime() -
        new Date(right.starts_at).getTime(),
    );
    const firstAppointment = sortedAppointments[0]!;
    const dayLabel = format(new Date(firstAppointment.starts_at), "EEEE d", {
      locale: es,
    });
    const timeLabel = format(new Date(firstAppointment.starts_at), "HH:mm");
    const capitalizedDay = dayLabel.charAt(0).toUpperCase() + dayLabel.slice(1);

    setGroupSheet({
      open: true,
      title: `${capitalizedDay} · ${timeLabel}`,
      subtitle: CALENDAR_COPY.week.groupSubtitle(sortedAppointments.length),
      appointments: sortedAppointments,
    });
  }, []);

  const handleNavigateToDay = useCallback(
    (date: Date) => {
      setWeekAnchor(date);
      setViewMode("day");
    },
    [setWeekAnchor, setViewMode],
  );

  useEffect(() => {
    updateCalendarWeekUiRefs({
      openGroupSheet: handleOpenGroupSheet,
      navigateToDay: handleNavigateToDay,
    });
  }, [handleNavigateToDay, handleOpenGroupSheet]);

  const handleSelectGroupAppointment = useCallback(
    (appointmentId: string) => {
      setGroupSheet(CLOSED_GROUP_SHEET);
      openEditDialog(appointmentId);
    },
    [openEditDialog],
  );

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

  useTopbarAction({
    title: CALENDAR_COPY.toolbar.newAppointment,
    testId: "calendar-create-trigger",
    onClick: () => openCreateDialog(),
  });

  return (
    <div
      data-testid="calendar-page"
      className="flex h-dvh flex-col overflow-hidden"
    >
      <CalendarToolbar
        rangeLabel={rangeLabel}
        viewMode={viewMode}
        filter={<CalendarEmployeeFilter />}
        statusBadge={<ClinicStatusBadge clinic={clinic} />}
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
        appointment={editingAppointment.data ?? null}
        loading={isLoadingAppointment}
        initialStartsAt={createStartsAt}
        onViewDetail={
          editingAppointmentId
            ? () => {
                closeDialog();
                router.push(`/appointments/${editingAppointmentId}`);
              }
            : undefined
        }
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
      <CalendarOverlapGroupSheet
        state={groupSheet}
        onOpenChange={(open) => {
          if (!open) {
            setGroupSheet(CLOSED_GROUP_SHEET);
          }
        }}
        onSelectAppointment={handleSelectGroupAppointment}
      />
      <MobileFab
        label={CALENDAR_COPY.toolbar.newAppointment}
        onClick={() => openCreateDialog()}
      />
    </div>
  );
}
