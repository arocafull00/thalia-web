import {
  addDays,
  addMinutes,
  addWeeks,
  getISODay,
  startOfDay,
  startOfWeek,
} from "date-fns";

import {
  instantToClinicWallDate,
  resolveAppointmentTimezone,
} from "@/lib/appointment-datetime";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";

type ExistingAppointment = {
  starts_at: string;
  ends_at: string;
};

const STEP_MINUTES = 30;
const MAX_SEARCH_DAYS = 30;
const DEFAULT_MAX_SLOTS = 5;
const ANYTIME_MAX_SLOTS = 12;

export type SlotSearchMode = "asap" | "next-week" | "anytime";

export function getSlotSearchRange(params: {
  from: Date;
  searchMode: SlotSearchMode;
}): { from: Date; to: Date } {
  const searchFrom =
    params.searchMode === "next-week"
      ? startOfWeek(addWeeks(params.from, 1), { weekStartsOn: 1 })
      : params.from;

  return {
    from: searchFrom,
    to: addDays(searchFrom, MAX_SEARCH_DAYS),
  };
}

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

function nextOpenDayOpening(from: Date, clinic: ClinicInfo): Date | null {
  if (clinic.open_days.length === 0) return null;
  const [openH, openM] = parseHHMM(clinic.opening_time);
  let day = startOfDay(addDays(from, 1));
  let guard = 0;
  while (!clinic.open_days.includes(getISODay(day))) {
    day = addDays(day, 1);
    if (++guard > 7) return null;
  }
  return addMinutes(startOfDay(day), toMinutes(openH, openM));
}

function getDateKey(date: Date): string {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function sampleEvenly<T>(items: T[], maxItems: number): T[] {
  if (items.length <= maxItems) {
    return items;
  }

  if (maxItems === 1) {
    return [items[0]];
  }

  const lastIndex = items.length - 1;

  return Array.from({ length: maxItems }, (_, index) => {
    const itemIndex = Math.round((index * lastIndex) / (maxItems - 1));
    return items[itemIndex];
  });
}

export function findAvailableSlots(params: {
  existing: ExistingAppointment[];
  clinic: ClinicInfo;
  durationMinutes: number;
  from: Date;
  searchMode?: SlotSearchMode;
  maxSlots?: number;
}): Date[] {
  const {
    existing,
    clinic,
    durationMinutes,
    from,
    searchMode = "asap",
  } = params;
  const maxSlots =
    params.maxSlots ??
    (searchMode === "anytime" ? ANYTIME_MAX_SLOTS : DEFAULT_MAX_SLOTS);

  if (maxSlots <= 0) {
    return [];
  }

  const duration = durationMinutes > 0 ? durationMinutes : STEP_MINUTES;
  const slots: Date[] = [];
  const sampledDays = new Set<string>();
  const searchRange = getSlotSearchRange({ from, searchMode });
  const [openH, openM] = parseHHMM(clinic.opening_time);
  const [closeH, closeM] = parseHHMM(clinic.closing_time);
  const openTotal = toMinutes(openH, openM);
  const closeTotal = toMinutes(closeH, closeM);
  const shouldDistribute = searchMode === "anytime";
  const timezone = resolveAppointmentTimezone(clinic.timezone);

  let current = roundUpToStep(searchRange.from, STEP_MINUTES);

  while (
    current < searchRange.to &&
    (shouldDistribute || slots.length < maxSlots)
  ) {
    const isoDay = getISODay(current);

    if (!clinic.open_days.includes(isoDay)) {
      const next = nextOpenDayOpening(current, clinic);
      if (!next) break;
      current = next;
      continue;
    }

    const slotTotal = toMinutes(current.getHours(), current.getMinutes());

    if (slotTotal < openTotal) {
      current = addMinutes(startOfDay(current), openTotal);
      continue;
    }

    if (slotTotal + duration > closeTotal) {
      const next = nextOpenDayOpening(current, clinic);
      if (!next) break;
      current = next;
      continue;
    }

    const slotEnd = addMinutes(current, duration);
    const hasConflict = existing.some((appt) => {
      const apptStart = instantToClinicWallDate(appt.starts_at, timezone);
      const apptEnd = instantToClinicWallDate(appt.ends_at, timezone);
      return current < apptEnd && slotEnd > apptStart;
    });

    const dateKey = getDateKey(current);

    if (!hasConflict && (!shouldDistribute || !sampledDays.has(dateKey))) {
      slots.push(new Date(current));
      sampledDays.add(dateKey);
    }

    current = addMinutes(current, STEP_MINUTES);
  }

  return shouldDistribute ? sampleEvenly(slots, maxSlots) : slots;
}
