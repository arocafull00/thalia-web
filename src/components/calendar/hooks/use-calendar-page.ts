"use client";

import { addDays, addMonths, addWeeks, format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

import { instantToClinicWallDate } from "@/lib/appointment-datetime";
import { formatFullDayLabel, formatMonthLabel } from "@/lib/calendar-grid";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import type { CalendarViewMode } from "@/stores/calendar-store";
import { useCalendarStore } from "@/stores/calendar-store";

function formatVisibleRangeLabel(startIso: string, endIso: string) {
  const start = new Date(`${startIso}T00:00:00`);
  const end = new Date(`${endIso}T00:00:00`);

  if (startIso === endIso) {
    return format(start, "EEEE, d 'de' MMMM", { locale: es });
  }

  const sameMonth =
    start.getMonth() === end.getMonth() &&
    start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    return `${format(start, "d", { locale: es })} – ${format(end, "d 'de' MMMM", { locale: es })}`;
  }

  return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM", { locale: es })}`;
}

export function useCalendarPage() {
  const timezone = useActiveClinicTimezone();
  const {
    weekAnchor,
    setWeekAnchor,
    viewMode,
    setViewMode,
    setEmployeeId,
    dialogOpen,
    createStartsAt,
    editingAppointmentId,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    visibleRangeStart,
    visibleRangeEnd,
  } = useCalendarStore(
    useShallow((state) => ({
      weekAnchor: state.weekAnchor,
      setWeekAnchor: state.setWeekAnchor,
      viewMode: state.viewMode,
      setViewMode: state.setViewMode,
      setEmployeeId: state.setEmployeeId,
      dialogOpen: state.dialogOpen,
      createStartsAt: state.createStartsAt,
      editingAppointmentId: state.editingAppointmentId,
      openCreateDialog: state.openCreateDialog,
      openEditDialog: state.openEditDialog,
      closeDialog: state.closeDialog,
      visibleRangeStart: state.visibleRangeStart,
      visibleRangeEnd: state.visibleRangeEnd,
    })),
  );

  useEffect(() => {
    const employeeIdParam = new URLSearchParams(window.location.search).get(
      "employeeId",
    );
    if (employeeIdParam) {
      setEmployeeId(employeeIdParam);
    }
  }, [setEmployeeId]);

  useEffect(() => {
    setWeekAnchor(instantToClinicWallDate(new Date(), timezone));
  }, [setWeekAnchor, timezone]);

  const rangeLabel =
    viewMode === "day"
      ? formatFullDayLabel(weekAnchor)
      : viewMode === "month"
        ? formatMonthLabel(weekAnchor)
        : visibleRangeStart && visibleRangeEnd
          ? formatVisibleRangeLabel(visibleRangeStart, visibleRangeEnd)
          : "";

  const onPrevious = () => {
    if (viewMode === "month") {
      setWeekAnchor(addMonths(weekAnchor, -1));
      return;
    }
    if (viewMode === "day") {
      setWeekAnchor(addDays(weekAnchor, -1));
      return;
    }
    setWeekAnchor(addWeeks(weekAnchor, -1));
  };

  const onNext = () => {
    if (viewMode === "month") {
      setWeekAnchor(addMonths(weekAnchor, 1));
      return;
    }
    if (viewMode === "day") {
      setWeekAnchor(addDays(weekAnchor, 1));
      return;
    }
    setWeekAnchor(addWeeks(weekAnchor, 1));
  };

  const onChangeViewMode = (mode: CalendarViewMode) => {
    setViewMode(mode);
    setWeekAnchor(instantToClinicWallDate(new Date(), timezone));
  };

  return {
    rangeLabel,
    viewMode,
    dialogOpen,
    createStartsAt,
    editingAppointmentId,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    onPrevious,
    onNext,
    onToday: () => setWeekAnchor(instantToClinicWallDate(new Date(), timezone)),
    onChangeViewMode,
  };
}
