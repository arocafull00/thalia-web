import { Temporal } from "temporal-polyfill";

import { CLINIC_TIME_ZONE } from "@/lib/constants";

export function resolveAppointmentTimezone(
  timezone: string | null | undefined,
) {
  return timezone?.trim() || CLINIC_TIME_ZONE;
}

export function instantToClinicWallDate(
  value: string | Date,
  timezone: string,
) {
  const instant =
    value instanceof Date
      ? Temporal.Instant.fromEpochMilliseconds(value.getTime())
      : Temporal.Instant.from(value);
  const zoned = instant.toZonedDateTimeISO(timezone);

  return new Date(
    zoned.year,
    zoned.month - 1,
    zoned.day,
    zoned.hour,
    zoned.minute,
    zoned.second,
    zoned.millisecond,
  );
}

type ClinicWallDateTimeFields = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  millisecond?: number;
};

export function clinicWallFieldsToIso(
  fields: ClinicWallDateTimeFields,
  timezone: string,
) {
  const { year, month, day, hour, minute } = fields;
  const second = fields.second ?? 0;
  const millisecond = fields.millisecond ?? 0;
  const wallEpochMilliseconds = Date.UTC(
    year,
    month - 1,
    day,
    hour,
    minute,
    second,
    millisecond,
  );
  const sampleDeltas = [-172_800_000, 0, 172_800_000];
  const offsets = new Set(
    sampleDeltas.map(
      (delta) =>
        Temporal.Instant.fromEpochMilliseconds(
          wallEpochMilliseconds + delta,
        ).toZonedDateTimeISO(timezone).offsetNanoseconds / 1_000_000,
    ),
  );
  const candidates = [...offsets]
    .map((offset) => wallEpochMilliseconds - offset)
    .filter((candidate) => {
      const zoned =
        Temporal.Instant.fromEpochMilliseconds(candidate).toZonedDateTimeISO(
          timezone,
        );

      return (
        zoned.year === year &&
        zoned.month === month &&
        zoned.day === day &&
        zoned.hour === hour &&
        zoned.minute === minute &&
        zoned.second === second &&
        zoned.millisecond === millisecond
      );
    });

  if (candidates.length !== 1) {
    throw new RangeError("Ambiguous or nonexistent clinic wall time");
  }

  return Temporal.Instant.fromEpochMilliseconds(candidates[0]).toString();
}

export function clinicWallDateToIso(value: Date, timezone: string) {
  return clinicWallFieldsToIso(
    {
      year: value.getFullYear(),
      month: value.getMonth() + 1,
      day: value.getDate(),
      hour: value.getHours(),
      minute: value.getMinutes(),
      second: value.getSeconds(),
      millisecond: value.getMilliseconds(),
    },
    timezone,
  );
}

export function instantToClinicZonedDateTime(
  value: string | Date,
  timezone: string,
) {
  const instant =
    value instanceof Date
      ? Temporal.Instant.fromEpochMilliseconds(value.getTime())
      : Temporal.Instant.from(value);

  return instant.toZonedDateTimeISO(timezone);
}

export function formatClinicDayKey(value: string | Date, timezone: string) {
  return instantToClinicZonedDateTime(value, timezone).toPlainDate().toString();
}

export function getClinicRangeIso(
  rangeStart: Date,
  rangeEnd: Date,
  timezone: string,
) {
  return {
    startIso: clinicWallDateToIso(rangeStart, timezone),
    endIso: clinicWallDateToIso(rangeEnd, timezone),
  };
}
