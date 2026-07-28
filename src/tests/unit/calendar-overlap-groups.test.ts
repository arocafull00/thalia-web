import { describe, expect, it } from "vitest";

import {
  formatProfessionalSummary,
  groupOverlappingAppointments,
  groupOverlappingAppointmentsByDay,
  intervalsOverlap,
} from "@/lib/calendar-overlap-groups";

const DAY = "2026-01-05";

function appt(id: string, startsAt: string, endsAt: string) {
  return { id, starts_at: startsAt, ends_at: endsAt };
}

describe("intervalsOverlap", () => {
  it("returns true when intervals partially overlap", () => {
    expect(intervalsOverlap(0, 60, 30, 90)).toBe(true);
  });

  it("returns false when intervals are adjacent but not overlapping", () => {
    expect(intervalsOverlap(0, 60, 60, 90)).toBe(false);
  });
});

describe("groupOverlappingAppointments", () => {
  it("returns singles only when appointments do not overlap", () => {
    const appointments = [
      appt("a", "2026-01-05T09:00:00", "2026-01-05T10:00:00"),
      appt("b", "2026-01-05T11:00:00", "2026-01-05T12:00:00"),
    ];

    const result = groupOverlappingAppointments(appointments, DAY);

    expect(result.singles).toHaveLength(2);
    expect(result.groups).toHaveLength(0);
  });

  it("groups two overlapping appointments", () => {
    const appointments = [
      appt("a", "2026-01-05T09:00:00", "2026-01-05T10:30:00"),
      appt("b", "2026-01-05T09:30:00", "2026-01-05T11:00:00"),
    ];

    const result = groupOverlappingAppointments(appointments, DAY);

    expect(result.singles).toHaveLength(0);
    expect(result.groups).toHaveLength(1);
    expect(result.groups[0]?.appointments.map((item) => item.id)).toEqual([
      "a",
      "b",
    ]);
  });

  it("groups chained overlaps A-B-C into one cluster", () => {
    const appointments = [
      appt("a", "2026-01-05T09:00:00", "2026-01-05T10:00:00"),
      appt("b", "2026-01-05T09:45:00", "2026-01-05T10:45:00"),
      appt("c", "2026-01-05T10:30:00", "2026-01-05T11:30:00"),
    ];

    const result = groupOverlappingAppointments(appointments, DAY);

    expect(result.groups).toHaveLength(1);
    expect(result.groups[0]?.appointments).toHaveLength(3);
    expect(result.groups[0]?.startMs).toBe(
      new Date("2026-01-05T09:00:00").getTime(),
    );
    expect(result.groups[0]?.endMs).toBe(
      new Date("2026-01-05T11:30:00").getTime(),
    );
  });

  it("groups multiple appointments starting at the same time", () => {
    const appointments = [
      appt("a", "2026-01-05T10:00:00", "2026-01-05T10:45:00"),
      appt("b", "2026-01-05T10:00:00", "2026-01-05T11:00:00"),
      appt("c", "2026-01-05T10:00:00", "2026-01-05T10:30:00"),
    ];

    const result = groupOverlappingAppointments(appointments, DAY);

    expect(result.groups).toHaveLength(1);
    expect(result.groups[0]?.appointments).toHaveLength(3);
  });

  it("keeps independent overlap clusters separate on the same day", () => {
    const appointments = [
      appt("a", "2026-01-05T09:00:00", "2026-01-05T10:00:00"),
      appt("b", "2026-01-05T09:30:00", "2026-01-05T10:30:00"),
      appt("c", "2026-01-05T12:00:00", "2026-01-05T13:00:00"),
      appt("d", "2026-01-05T14:00:00", "2026-01-05T15:00:00"),
    ];

    const result = groupOverlappingAppointments(appointments, DAY);

    expect(result.groups).toHaveLength(1);
    expect(result.singles.map((item) => item.id)).toEqual(["c", "d"]);
  });

  it("keeps two independent overlap groups on the same day", () => {
    const appointments = [
      appt("a", "2026-01-05T09:00:00", "2026-01-05T10:00:00"),
      appt("b", "2026-01-05T09:30:00", "2026-01-05T10:30:00"),
      appt("c", "2026-01-05T14:00:00", "2026-01-05T15:00:00"),
      appt("d", "2026-01-05T14:30:00", "2026-01-05T15:30:00"),
    ];

    const result = groupOverlappingAppointments(appointments, DAY);

    expect(result.singles).toHaveLength(0);
    expect(result.groups).toHaveLength(2);
    expect(result.groups[0]?.appointments.map((item) => item.id)).toEqual([
      "a",
      "b",
    ]);
    expect(result.groups[1]?.appointments.map((item) => item.id)).toEqual([
      "c",
      "d",
    ]);
  });
});

describe("groupOverlappingAppointmentsByDay", () => {
  it("partitions appointments per day before grouping", () => {
    const appointments = [
      appt("a", "2026-01-05T09:00:00", "2026-01-05T10:00:00"),
      appt("b", "2026-01-05T09:30:00", "2026-01-05T10:30:00"),
      appt("c", "2026-01-06T09:00:00", "2026-01-06T10:00:00"),
    ];

    const result = groupOverlappingAppointmentsByDay(appointments, (item) =>
      item.starts_at.slice(0, 10),
    );

    expect(result.groups).toHaveLength(1);
    expect(result.singles.map((item) => item.id)).toEqual(["c"]);
  });
});

describe("formatProfessionalSummary", () => {
  it("formats visible names and remaining count", () => {
    expect(
      formatProfessionalSummary(["Diego", "Andrés", "Carlos", "Elena"]),
    ).toBe("Diego, Andrés, Carlos y 1 más");
  });
});
