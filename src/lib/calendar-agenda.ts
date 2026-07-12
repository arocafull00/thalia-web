import { format } from "date-fns";

import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { HOUR_HEIGHT } from "@/lib/calendar-grid";
import type { AppointmentWithRelations } from "@/types/database.types";

export const AGENDA_CARD_MIN_HEIGHT = 72;
export const AGENDA_CARD_STACK_GAP = 8;
export const AGENDA_HOUR_PADDING = 8;

export type AgendaAppointment = {
  id: string;
  startsAt: Date;
  endsAt: Date;
  patientName: string;
  treatmentName: string;
  employeeName: string | null;
  employeeColor: string | null;
};

export function toAgendaAppointments(
  data: AppointmentWithRelations[] | null | undefined,
): AgendaAppointment[] {
  return (data ?? [])
    .map((appointment) => ({
      id: appointment.id,
      startsAt: new Date(appointment.starts_at),
      endsAt: new Date(appointment.ends_at),
      patientName:
        appointment.patients?.full_name ?? CALENDAR_COPY.event.defaultPatient,
      treatmentName:
        appointment.appointment_treatments[0]?.treatment?.name ??
        CALENDAR_COPY.event.defaultTreatment,
      employeeName: appointment.employees?.full_name ?? null,
      employeeColor: appointment.employees?.color ?? null,
    }))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export function groupAppointmentsByHour(
  appointments: AgendaAppointment[],
): Map<number, AgendaAppointment[]> {
  const grouped = new Map<number, AgendaAppointment[]>();

  for (const appointment of appointments) {
    const hour = appointment.startsAt.getHours();
    const existing = grouped.get(hour) ?? [];
    existing.push(appointment);
    grouped.set(hour, existing);
  }

  return grouped;
}

export function getAgendaHourRowHeight(appointmentCount: number): number {
  if (appointmentCount === 0) {
    return HOUR_HEIGHT;
  }

  const cardsHeight =
    appointmentCount * AGENDA_CARD_MIN_HEIGHT +
    (appointmentCount - 1) * AGENDA_CARD_STACK_GAP;

  return Math.max(HOUR_HEIGHT, cardsHeight + AGENDA_HOUR_PADDING);
}

export function buildHasAppointmentsOnDay(
  appointments: AgendaAppointment[],
): (day: Date) => boolean {
  const days = new Set(
    appointments.map((appointment) =>
      format(appointment.startsAt, "yyyy-MM-dd"),
    ),
  );

  return (day: Date) => days.has(format(day, "yyyy-MM-dd"));
}
