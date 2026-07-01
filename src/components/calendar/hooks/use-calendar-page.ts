"use client";

import { addWeeks } from "date-fns";
import { useEffect } from "react";

import { formatWeekRange } from "@/lib/calendar-grid";
import { useCalendarStore } from "@/stores/calendar-store";

export function useCalendarPage() {
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const setWeekAnchor = useCalendarStore((state) => state.setWeekAnchor);
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

  const weekRangeLabel = formatWeekRange(weekAnchor);

  return {
    weekRangeLabel,
    dialogOpen,
    createStartsAt,
    openCreateDialog,
    closeDialog,
    onPreviousWeek: () => setWeekAnchor(addWeeks(weekAnchor, -1)),
    onNextWeek: () => setWeekAnchor(addWeeks(weekAnchor, 1)),
    onToday: () => setWeekAnchor(new Date()),
  };
}
