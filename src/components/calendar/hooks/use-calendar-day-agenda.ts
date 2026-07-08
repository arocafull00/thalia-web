"use client";

import { toAgendaAppointments } from "@/lib/calendar-agenda";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useCalendarStore } from "@/stores/calendar-store";

export function useCalendarDayAgenda() {
  const day = useCalendarStore((state) => state.weekAnchor);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const appointments = useAppointments(day, employeeId);

  return {
    agenda: toAgendaAppointments(appointments.data),
    isLoading: appointments.isLoading,
  };
}
