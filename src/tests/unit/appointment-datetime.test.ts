import { describe, expect, it } from "vitest";

import {
  clinicWallDateToIso,
  clinicWallFieldsToIso,
  formatClinicDayKey,
  getClinicRangeIso,
  instantToClinicWallDate,
  instantToClinicZonedDateTime,
} from "@/lib/appointment-datetime";

const MADRID = "Europe/Madrid";

describe("appointment datetime", () => {
  it("serializes a Madrid summer wall time as UTC", () => {
    const wallDate = new Date(2026, 6, 15, 21, 0, 0, 0);

    expect(clinicWallDateToIso(wallDate, MADRID)).toBe("2026-07-15T19:00:00Z");
  });

  it("serializes a Madrid winter wall time as UTC", () => {
    const wallDate = new Date(2026, 0, 15, 21, 0, 0, 0);

    expect(clinicWallDateToIso(wallDate, MADRID)).toBe("2026-01-15T20:00:00Z");
  });

  it("round-trips an instant through clinic wall-clock fields", () => {
    const wallDate = instantToClinicWallDate("2026-07-15T19:00:00Z", MADRID);

    expect(wallDate.getFullYear()).toBe(2026);
    expect(wallDate.getMonth()).toBe(6);
    expect(wallDate.getDate()).toBe(15);
    expect(wallDate.getHours()).toBe(21);
    expect(clinicWallDateToIso(wallDate, MADRID)).toBe("2026-07-15T19:00:00Z");
  });

  it("rejects nonexistent and duplicated DST wall times", () => {
    expect(() =>
      clinicWallFieldsToIso(
        { year: 2026, month: 3, day: 29, hour: 2, minute: 30 },
        MADRID,
      ),
    ).toThrow();
    expect(() =>
      clinicWallFieldsToIso(
        { year: 2026, month: 10, day: 25, hour: 2, minute: 30 },
        MADRID,
      ),
    ).toThrow();
  });

  it("builds clinic day ranges and day keys independently of UTC", () => {
    const range = getClinicRangeIso(
      new Date(2026, 6, 15, 0, 0, 0, 0),
      new Date(2026, 6, 15, 23, 59, 59, 999),
      MADRID,
    );

    expect(range).toEqual({
      startIso: "2026-07-14T22:00:00Z",
      endIso: "2026-07-15T21:59:59.999Z",
    });
    expect(formatClinicDayKey("2026-07-14T22:30:00Z", MADRID)).toBe(
      "2026-07-15",
    );
  });

  it("creates calendar events in the clinic timezone", () => {
    const zoned = instantToClinicZonedDateTime("2026-07-15T19:00:00Z", MADRID);

    expect(zoned.timeZoneId).toBe(MADRID);
    expect(zoned.hour).toBe(21);
  });
});
