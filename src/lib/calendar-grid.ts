import {
  addDays,
  differenceInMinutes,
  endOfDay,
  format,
  isSameDay,
  isToday,
  setHours,
  setMinutes,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";

export const CALENDAR_START_HOUR = 8;
export const CALENDAR_END_HOUR = 20;
export const SLOT_MINUTES = 30;
export const SLOT_HEIGHT = 28;
export const HOUR_HEIGHT = SLOT_HEIGHT * 2;
export const DAY_HEADER_HEIGHT = 56;
export const TIME_COLUMN_WIDTH = 60;
export const DAY_COLUMN_MIN_WIDTH = 120;
export const TOTAL_SLOTS = ((CALENDAR_END_HOUR - CALENDAR_START_HOUR) * 60) / SLOT_MINUTES;
export const GRID_HEIGHT = TOTAL_SLOTS * SLOT_HEIGHT;

export function getWeekDays(anchorDate: Date): Date[] {
  const weekStart = startOfWeek(anchorDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function getWeekRange(anchorDate: Date): { start: Date; end: Date } {
  const days = getWeekDays(anchorDate);
  return {
    start: startOfDay(days[0]),
    end: endOfDay(days[days.length - 1]),
  };
}

export function formatWeekRange(anchorDate: Date): string {
  const days = getWeekDays(anchorDate);
  const first = days[0];
  const last = days[days.length - 1];
  const firstLabel = format(first, "EEE d", { locale: es });
  const lastLabel = format(last, "EEE d MMMM", { locale: es });

  if (isSameDay(first, last)) {
    return format(first, "EEEE d 'de' MMMM", { locale: es });
  }

  return `${firstLabel.charAt(0).toUpperCase()}${firstLabel.slice(1)} – ${lastLabel.charAt(0).toUpperCase()}${lastLabel.slice(1)}`;
}

export function getDayStart(date: Date): Date {
  return setMinutes(setHours(startOfDay(date), CALENDAR_START_HOUR), 0);
}

export function getDayEnd(date: Date): Date {
  return setMinutes(setHours(startOfDay(date), CALENDAR_END_HOUR), 0);
}

export function minutesToOffset(minutesFromStart: number): number {
  return (minutesFromStart / SLOT_MINUTES) * SLOT_HEIGHT;
}

export function appointmentLayout(
  startsAt: Date,
  endsAt: Date,
  day: Date,
): { top: number; height: number } | null {
  const dayStart = getDayStart(day);
  const dayEnd = getDayEnd(day);

  if (endsAt <= dayStart || startsAt >= dayEnd) {
    return null;
  }

  const visibleStart = startsAt < dayStart ? dayStart : startsAt;
  const visibleEnd = endsAt > dayEnd ? dayEnd : endsAt;
  const startMinutes = differenceInMinutes(visibleStart, dayStart);
  const durationMinutes = differenceInMinutes(visibleEnd, visibleStart);
  const top = minutesToOffset(startMinutes);
  const height = Math.max(minutesToOffset(durationMinutes), SLOT_HEIGHT);

  return { top, height };
}

type PressNativeEvent = {
  locationY?: number;
  offsetY?: number;
  y?: number;
};

export function getPressLocationY(nativeEvent: PressNativeEvent): number {
  const candidates = [nativeEvent.locationY, nativeEvent.offsetY, nativeEvent.y];

  for (const value of candidates) {
    if (typeof value === "number" && Number.isFinite(value)) {
      return value;
    }
  }

  return 0;
}

export function slotFromY(y: number, day: Date): Date {
  const safeY = Number.isFinite(y) ? y : 0;
  const slotIndex = Math.max(0, Math.min(TOTAL_SLOTS - 1, Math.floor(safeY / SLOT_HEIGHT)));
  const dayStart = getDayStart(day);
  return new Date(dayStart.getTime() + slotIndex * SLOT_MINUTES * 60 * 1000);
}

export function getNowIndicatorOffset(now: Date): number | null {
  const dayStart = getDayStart(now);
  const dayEnd = getDayEnd(now);

  if (now < dayStart || now >= dayEnd) {
    return null;
  }

  return minutesToOffset(differenceInMinutes(now, dayStart));
}

export function isDayInWeek(day: Date, anchorDate: Date): boolean {
  return getWeekDays(anchorDate).some((weekDay) => isSameDay(weekDay, day));
}

export function formatDayHeader(day: Date): {
  weekday: string;
  dayNumber: string;
  isToday: boolean;
} {
  const weekday = format(day, "EEE", { locale: es }).toUpperCase();
  return {
    weekday,
    dayNumber: format(day, "d"),
    isToday: isToday(day),
  };
}

export type AppointmentColumnLayout = {
  appointmentId: string;
  columnIndex: number;
  columnCount: number;
};

export function layoutOverlappingAppointments<
  T extends { id: string; starts_at: string; ends_at: string },
>(appointments: T[]): Map<string, AppointmentColumnLayout> {
  const sorted = [...appointments].sort(
    (left, right) => new Date(left.starts_at).getTime() - new Date(right.starts_at).getTime(),
  );
  const layout = new Map<string, AppointmentColumnLayout>();

  type ActiveEntry = { id: string; end: number; columnIndex: number };
  let active: ActiveEntry[] = [];

  for (const appointment of sorted) {
    const start = new Date(appointment.starts_at).getTime();
    const end = new Date(appointment.ends_at).getTime();
    active = active.filter((entry) => entry.end > start);

    const usedColumns = new Set(active.map((entry) => entry.columnIndex));
    let columnIndex = 0;

    while (usedColumns.has(columnIndex)) {
      columnIndex += 1;
    }

    active.push({ id: appointment.id, end, columnIndex });
    const columnCount = Math.max(...active.map((entry) => entry.columnIndex), columnIndex) + 1;

    for (const entry of active) {
      const current = layout.get(entry.id);

      if (!current || columnCount > current.columnCount) {
        layout.set(entry.id, {
          appointmentId: entry.id,
          columnIndex: entry.columnIndex,
          columnCount,
        });
      }
    }
  }

  return layout;
}
