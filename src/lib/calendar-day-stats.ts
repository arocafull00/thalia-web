import { differenceInMinutes, format } from "date-fns";

import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import type { AppointmentWithRelations } from "@/types/database.types";

export type DayStats = {
  dateKey: string;
  appointmentCount: number;
  occupancyPercent: number;
  isClosed: boolean;
};

function parseHHMM(time: string): [number, number] {
  const parts = time.split(":");
  return [Number(parts[0]), Number(parts[1] ?? 0)];
}

function getClinicOpenMinutes(clinic: ClinicInfo): number {
  const [openH, openM] = parseHHMM(clinic.opening_time);
  const [closeH, closeM] = parseHHMM(clinic.closing_time);
  return closeH * 60 + closeM - (openH * 60 + openM);
}

function jsDayToIsoDay(jsDay: number) {
  return jsDay === 0 ? 7 : jsDay;
}

function getAppointmentDayKey(startsAt: string) {
  return format(new Date(startsAt), "yyyy-MM-dd");
}

export function computeDayStats(
  appointments: AppointmentWithRelations[],
  clinic: ClinicInfo | null,
): Map<string, DayStats> {
  const stats = new Map<string, DayStats>();
  const byDay = new Map<string, AppointmentWithRelations[]>();

  for (const appointment of appointments) {
    const dayKey = getAppointmentDayKey(appointment.starts_at);
    const existing = byDay.get(dayKey) ?? [];
    existing.push(appointment);
    byDay.set(dayKey, existing);
  }

  for (const [dateKey, dayAppointments] of byDay) {
    const dayDate = new Date(`${dateKey}T12:00:00`);
    const isoDay = jsDayToIsoDay(dayDate.getDay());
    const isClosed = clinic ? !clinic.open_days.includes(isoDay) : false;

    if (isClosed) {
      stats.set(dateKey, {
        dateKey,
        appointmentCount: dayAppointments.length,
        occupancyPercent: 0,
        isClosed: true,
      });
      continue;
    }

    const totalMinutes = dayAppointments.reduce((sum, appointment) => {
      return (
        sum +
        differenceInMinutes(
          new Date(appointment.ends_at),
          new Date(appointment.starts_at),
        )
      );
    }, 0);

    const professionalIds = new Set(
      dayAppointments.map((appointment) => appointment.employee_id),
    );
    const activeProfessionalCount = Math.max(professionalIds.size, 1);
    const clinicOpenMinutes = clinic ? getClinicOpenMinutes(clinic) : 0;
    const capacityMinutes = clinicOpenMinutes * activeProfessionalCount;
    const occupancyPercent =
      capacityMinutes > 0
        ? Math.min(100, Math.round((totalMinutes / capacityMinutes) * 100))
        : 0;

    stats.set(dateKey, {
      dateKey,
      appointmentCount: dayAppointments.length,
      occupancyPercent,
      isClosed: false,
    });
  }

  return stats;
}

export function computeDayStatsForRange(
  appointments: AppointmentWithRelations[],
  clinic: ClinicInfo | null,
  dayKeys: string[],
): Map<string, DayStats> {
  const computed = computeDayStats(appointments, clinic);

  for (const dateKey of dayKeys) {
    if (computed.has(dateKey)) {
      continue;
    }

    const dayDate = new Date(`${dateKey}T12:00:00`);
    const isoDay = jsDayToIsoDay(dayDate.getDay());
    const isClosed = clinic ? !clinic.open_days.includes(isoDay) : false;

    computed.set(dateKey, {
      dateKey,
      appointmentCount: 0,
      occupancyPercent: 0,
      isClosed,
    });
  }

  return computed;
}

export function countAvailableSlotsInGroup(
  appointments: AppointmentWithRelations[],
): number {
  const professionalCount = new Set(
    appointments.map((appointment) => appointment.employee_id),
  ).size;

  return Math.max(0, professionalCount - appointments.length);
}
