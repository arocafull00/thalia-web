"use client";

import {
  endOfMonth,
  format,
  isSameDay,
  setHours,
  setMinutes,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { es } from "date-fns/locale";
import { useMemo, useState } from "react";

import {
  buildHasAppointmentsOnDay,
  toAgendaAppointments,
} from "@/lib/calendar-agenda";
import { CALENDAR_START_HOUR } from "@/lib/calendar-grid";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useCalendarStore } from "@/stores/calendar-store";

export function useCalendarMobileMonth() {
  const monthAnchor = useCalendarStore((state) => state.weekAnchor);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const openCreateDialog = useCalendarStore((state) => state.openCreateDialog);
  const [selectedDay, setSelectedDay] = useState(() => startOfDay(new Date()));

  const monthRange = useMemo(
    () => ({
      start: startOfMonth(monthAnchor),
      end: endOfMonth(monthAnchor),
    }),
    [monthAnchor],
  );

  const appointments = useAppointments(monthRange, employeeId);
  const monthAgenda = toAgendaAppointments(appointments.data);
  const hasAppointmentsOnDay = buildHasAppointmentsOnDay(monthAgenda);
  const selectedDayAgenda = monthAgenda.filter((appointment) =>
    isSameDay(appointment.startsAt, selectedDay),
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
