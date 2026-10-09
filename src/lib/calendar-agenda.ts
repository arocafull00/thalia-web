import { format } from "date-fns";

import { CALENDAR_COPY } from "@/copy/calendar-copy";
import {
  formatClinicDayKey,
  instantToClinicZonedDateTime,
} from "@/lib/appointment-datetime";
import {
  getAppointmentStockIssue,
  type AppointmentStockIssue,
} from "@/lib/appointment-stock";
import { HOUR_HEIGHT } from "@/lib/calendar-grid";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

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
  status: AppointmentStatus | null;
  stockIssue: AppointmentStockIssue | null;
  /**
   * Suma de los precios con los que se reservaron los tratamientos.
   *
   * Es el MISMO cálculo que hace la base al completar la cita
   * (`private.handle_appointment_completed`: `SUM(price_at_booking)`), así que
   * en una cita completada coincide con el ingreso que hay en finanzas.
   *
   * En una cita que no está completada es un importe PREVISTO: el ingreso no
   * existe todavía, porque el trigger solo lo crea al pasar a `completed`.
   * Quien lo pinte tiene que distinguir los dos casos o estará afirmando un
   * ingreso que no se ha producido.
   *
   * `null` cuando ningún tratamiento tiene precio reservado: no es lo mismo que
   * cero euros, y permite no pintar nada en lugar de pintar «0,00 €».
   */
  amount: number | null;
};

/* Separada para poder afirmarla en un test: es la cifra que el usuario va a
   comparar con la pantalla de finanzas. */
export function appointmentBookedAmount(
  appointment: AppointmentWithRelations,
): number | null {
  const prices = appointment.appointment_treatments
    .map((entry) => entry.price_at_booking)
    .filter((price): price is number => typeof price === "number");

  if (prices.length === 0) return null;

  return prices.reduce((total, price) => total + price, 0);
}

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
      status: appointment.status,
      stockIssue: getAppointmentStockIssue(appointment),
      amount: appointmentBookedAmount(appointment),
    }))
    .sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());
}

export function groupAppointmentsByHour(
  appointments: AgendaAppointment[],
  timezone: string,
): Map<number, AgendaAppointment[]> {
  const grouped = new Map<number, AgendaAppointment[]>();

  for (const appointment of appointments) {
    const hour = instantToClinicZonedDateTime(
      appointment.startsAt,
      timezone,
    ).hour;
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
  timezone: string,
): (day: Date) => boolean {
  const days = new Set(
    appointments.map((appointment) =>
      formatClinicDayKey(appointment.startsAt, timezone),
    ),
  );

  return (day: Date) => days.has(format(day, "yyyy-MM-dd"));
}
