"use client";

import { useEffect } from "react";
import { addWeeks, endOfWeek, format, startOfWeek } from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";

import { CALENDAR_COPY } from "@/components/calendar/calendar-copy";
import { formatWeekRange } from "@/lib/calendar-grid";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useCalendarStore } from "@/stores/calendar-store";

export function useCalendarPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeIdParam = searchParams.get("employeeId");
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const setWeekAnchor = useCalendarStore((state) => state.setWeekAnchor);
  const setEmployeeId = useCalendarStore((state) => state.setEmployeeId);

  const rangeStart = startOfWeek(weekAnchor, { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(weekAnchor, { weekStartsOn: 1 });
  const appointments = useAppointments({ start: rangeStart, end: rangeEnd }, employeeId);

  useEffect(() => {
    if (employeeIdParam) {
      setEmployeeId(employeeIdParam);
    }
  }, [employeeIdParam, setEmployeeId]);

  const weekRangeLabel = formatWeekRange(weekAnchor);
  const loadingLabel = CALENDAR_COPY.toolbar.loading(format(rangeStart, "dd/MM"));

  return {
    weekRangeLabel,
    isLoading: appointments.isLoading,
    loadingLabel,
    onPreviousWeek: () => setWeekAnchor(addWeeks(weekAnchor, -1)),
    onNextWeek: () => setWeekAnchor(addWeeks(weekAnchor, 1)),
    onToday: () => setWeekAnchor(new Date()),
    onNewAppointment: () => router.push("/appointments/new"),
  };
}
