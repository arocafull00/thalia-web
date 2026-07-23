import { addDays, addMinutes, getISODay, startOfDay } from "date-fns";

import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";

type ExistingAppointment = {
  starts_at: string;
  ends_at: string;
};

const STEP_MINUTES = 30;
const MAX_SEARCH_DAYS = 30;

function parseHHMM(time: string): [number, number] {
  const parts = time.split(":");
  return [Number(parts[0]), Number(parts[1] ?? 0)];
}

function toMinutes(h: number, m: number): number {
  return h * 60 + m;
}

function roundUpToStep(date: Date, stepMinutes: number): Date {
  // Add 5-minute buffer so we don't offer slots that are already starting
  const ms = date.getTime() + 5 * 60 * 1000;
  const stepMs = stepMinutes * 60 * 1000;
  return new Date(Math.ceil(ms / stepMs) * stepMs);
}

function nextOpenDayOpening(from: Date, clinic: ClinicInfo): Date {
  const [openH, openM] = parseHHMM(clinic.opening_time);
  let day = startOfDay(addDays(from, 1));
  while (!clinic.open_days.includes(getISODay(day))) {
    day = addDays(day, 1);
  }
  return addMinutes(startOfDay(day), toMinutes(openH, openM));
}

export function findAvailableSlots(params: {
  existing: ExistingAppointment[];
  clinic: ClinicInfo;
  durationMinutes: number;
  from: Date;
  maxSlots?: number;
}): Date[] {
  const { existing, clinic, durationMinutes, from, maxSlots = 5 } = params;
  const duration = durationMinutes > 0 ? durationMinutes : STEP_MINUTES;
  const slots: Date[] = [];
  const limit = addDays(from, MAX_SEARCH_DAYS);
  const [openH, openM] = parseHHMM(clinic.opening_time);
  const [closeH, closeM] = parseHHMM(clinic.closing_time);
  const openTotal = toMinutes(openH, openM);
  const closeTotal = toMinutes(closeH, closeM);

  let current = roundUpToStep(from, STEP_MINUTES);

  while (current < limit && slots.length < maxSlots) {
    const isoDay = getISODay(current);

    if (!clinic.open_days.includes(isoDay)) {
      current = nextOpenDayOpening(current, clinic);
      continue;
    }

    const slotTotal = toMinutes(current.getHours(), current.getMinutes());

    if (slotTotal < openTotal) {
      current = addMinutes(startOfDay(current), openTotal);
      continue;
    }

    if (slotTotal + duration > closeTotal) {
      current = nextOpenDayOpening(current, clinic);
      continue;
    }

    const slotEnd = addMinutes(current, duration);
    const hasConflict = existing.some((appt) => {
      const apptStart = new Date(appt.starts_at);
      const apptEnd = new Date(appt.ends_at);
      return current < apptEnd && slotEnd > apptStart;
    });

    if (!hasConflict) {
      slots.push(new Date(current));
    }

    current = addMinutes(current, STEP_MINUTES);
  }

  return slots;
}
