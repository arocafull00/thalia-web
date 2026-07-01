"use client";

import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { formatWeekRange } from "@/lib/calendar-grid";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useCalendarStore } from "@/stores/calendar-store";

export function useCalendarPage() {
  const searchParams = useSearchParams();
  const employeeIdParam = searchParams.get("employeeId");
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setWeekAnchor = useCalendarStore((state) => state.setWeekAnchor);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);
  const dialogOpen = useCalendarStore((state) => state.dialogOpen);
  const createStartsAt = useCalendarStore((state) => state.createStartsAt);
  const openCreateDialog = useCalendarStore((state) => state.openCreateDialog);
  const closeDialog = useCalendarStore((state) => state.closeDialog);

  const rangeStart = startOfWeek(weekAnchor, { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(weekAnchor, { weekStartsOn: 1 });
  const appointments = useAppointments(
    { start: rangeStart, end: rangeEnd },
    employeeId,
  );

  useEffect(() => {
    if (employeeIdParam) {
      setEmployeeId(employeeIdParam);
    }
  }, [employeeIdParam, setEmployeeId]);

  const weekRangeLabel = formatWeekRange(weekAnchor);
  const loadingLabel = CALENDAR_COPY.toolbar.loading(
    format(rangeStart, "dd/MM"),
  );

  return {
    weekRangeLabel,
    isLoading: appointments.isLoading,
    loadingLabel,
    dialogOpen,
    createStartsAt,
    openCreateDialog,
    closeDialog,
    onPreviousWeek: () => setWeekAnchor(addWeeks(weekAnchor, -1)),
    onNextWeek: () => setWeekAnchor(addWeeks(weekAnchor, 1)),
    onToday: () => setWeekAnchor(new Date()),
  };
}
