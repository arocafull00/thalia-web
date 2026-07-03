"use client";

import { addMonths, addWeeks } from "date-fns";
import { useEffect } from "react";

import { formatMonthLabel, formatWeekRange } from "@/lib/calendar-grid";
import type { CalendarViewMode } from "@/stores/calendar-store";
import { useCalendarStore } from "@/stores/calendar-store";

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
      : formatWeekRange(weekAnchor);

  const onPrevious = () => {
    if (viewMode === "month") {
      setWeekAnchor(addMonths(weekAnchor, -1));
      return;
    }
    setWeekAnchor(addWeeks(weekAnchor, -1));
  };

  const onNext = () => {
    if (viewMode === "month") {
      setWeekAnchor(addMonths(weekAnchor, 1));
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
