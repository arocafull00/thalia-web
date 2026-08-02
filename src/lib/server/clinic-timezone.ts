import "server-only";

import { endOfDay, endOfWeek, format, startOfDay, startOfWeek } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

import { CLINIC_TIME_ZONE } from "@/lib/constants";

export function resolveClinicTimezone(timezone: string | null | undefined) {
  return timezone?.trim() || CLINIC_TIME_ZONE;
}

export function getClinicDayRange(
  timezone: string | null | undefined,
  referenceDate = new Date(),
) {
  const zone = resolveClinicTimezone(timezone);
  const zonedNow = toZonedTime(referenceDate, zone);
  const dayStart = startOfDay(zonedNow);
  const dayEnd = endOfDay(zonedNow);

  return {
    from: fromZonedTime(dayStart, zone).toISOString(),
    to: fromZonedTime(dayEnd, zone).toISOString(),
  };
}

export function getClinicIsoWeekRange(
  timezone: string | null | undefined,
  referenceDate = new Date(),
) {
  const zone = resolveClinicTimezone(timezone);
  const zonedNow = toZonedTime(referenceDate, zone);
  const weekStart = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(zonedNow, { weekStartsOn: 1 });

  return {
    from: fromZonedTime(weekStart, zone).toISOString(),
    to: fromZonedTime(weekEnd, zone).toISOString(),
  };
}

export function getClinicIsoWeekDateParams(
  timezone: string | null | undefined,
  referenceDate = new Date(),
) {
  const zone = resolveClinicTimezone(timezone);
  const zonedNow = toZonedTime(referenceDate, zone);
  const weekStart = startOfWeek(zonedNow, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(zonedNow, { weekStartsOn: 1 });

  return {
    from: format(weekStart, "yyyy-MM-dd"),
    to: format(weekEnd, "yyyy-MM-dd"),
  };
}

export function getClinicIsoDateRange(
  timezone: string | null | undefined,
  from: string,
  to: string,
) {
  const zone = resolveClinicTimezone(timezone);

  return {
    from: fromZonedTime(`${from}T00:00:00.000`, zone).toISOString(),
    to: fromZonedTime(`${to}T23:59:59.999`, zone).toISOString(),
  };
}
