"use client";

import {
  endOfMonth,
  format,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import { useMemo, useState } from "react";

import {
  formatClinicDayKey,
  instantToClinicWallDate,
} from "@/lib/appointment-datetime";
import {
  buildHasAppointmentsOnDay,
  toAgendaAppointments,
} from "@/lib/calendar-agenda";
import { CALENDAR_START_HOUR } from "@/lib/calendar-grid";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useCalendarStore } from "@/stores/calendar-store";

export function useCalendarMobileMonth() {
  const timezone = useActiveClinicTimezone();
  const monthAnchor = useCalendarStore((state) => state.weekAnchor);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const openCreateDialog = useCalendarStore((state) => state.openCreateDialog);
  const [selectedDay, setSelectedDay] = useState(() =>
    startOfDay(instantToClinicWallDate(new Date(), timezone)),
  );

  const monthRange = useMemo(
    () => ({
      start: startOfMonth(monthAnchor),
      end: endOfMonth(monthAnchor),
    }),
    [monthAnchor],
  );

  const appointments = useAppointments(monthRange, employeeId);
  const monthAgenda = toAgendaAppointments(appointments.data);
  const hasAppointmentsOnDay = buildHasAppointmentsOnDay(monthAgenda, timezone);
  const selectedDayKey = format(selectedDay, "yyyy-MM-dd");
  const selectedDayAgenda = monthAgenda.filter(
    (appointment) =>
      formatClinicDayKey(appointment.startsAt, timezone) === selectedDayKey,
  );

  const selectedDayLabel = format(selectedDay, "d 'de' MMMM", { locale: es });

  const onSelectDay = (day: Date) => {
    setSelectedDay(startOfDay(day));
  };

  const onCreateAppointment = () => {
    const startsAt = setMinutes(setHours(selectedDay, CALENDAR_START_HOUR), 0);
    openCreateDialog(startsAt);
  };

  return {
    monthAnchor,
    hasAppointmentsOnDay,
    selectedDay,
    selectedDayLabel,
    selectedDayAgenda,
    onSelectDay,
    onCreateAppointment,
  };
}
