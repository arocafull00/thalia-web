"use client";

import { addDays, addMonths, addWeeks, format } from "date-fns";
import { es } from "date-fns/locale";
import { useEffect } from "react";

import { formatMonthLabel } from "@/lib/calendar-grid";
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
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const setWeekAnchor = useCalendarStore((state) => state.setWeekAnchor);
  const viewMode = useCalendarStore((state) => state.viewMode);
  const setViewMode = useCalendarStore((state) => state.setViewMode);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);
  const dialogOpen = useCalendarStore((state) => state.dialogOpen);
  const createStartsAt = useCalendarStore((state) => state.createStartsAt);
  const openCreateDialog = useCalendarStore((state) => state.openCreateDialog);
  const closeDialog = useCalendarStore((state) => state.closeDialog);
  const visibleRangeStart = useCalendarStore(
    (state) => state.visibleRangeStart,
  );
  const visibleRangeEnd = useCalendarStore((state) => state.visibleRangeEnd);

  useEffect(() => {
    const employeeIdParam = new URLSearchParams(window.location.search).get(
      "employeeId",
    );
    if (employeeIdParam) {
      setEmployeeId(employeeIdParam);
    }
  }, [setEmployeeId]);

  const rangeLabel =
    viewMode === "month"
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
    setWeekAnchor(new Date());
  };

  return {
    rangeLabel,
    viewMode,
    dialogOpen,
    createStartsAt,
    openCreateDialog,
    closeDialog,
    onPrevious,
    onNext,
    onToday: () => setWeekAnchor(new Date()),
    onChangeViewMode,
  };
}
