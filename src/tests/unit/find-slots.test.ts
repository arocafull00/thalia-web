import { describe, expect, it } from "vitest";

import { findAvailableSlots } from "@/lib/find-slots";

// Minimal shape — only the fields find-slots.ts reads at runtime
type TestClinic = {
  open_days: number[];
  opening_time: string;
  closing_time: string;
  [key: string]: unknown;
};

// 2026-01-05 is a Monday
const MON = (h = 0, m = 0) => new Date(2026, 0, 5, h, m, 0, 0);
const FRI = (h = 0, m = 0) => new Date(2026, 0, 9, h, m, 0, 0);

const CLINIC: TestClinic = {
  open_days: [1, 2, 3, 4, 5], // Mon–Fri
  opening_time: "09:00",
  closing_time: "18:00",
};

describe("findAvailableSlots", () => {
  it("returns up to maxSlots slots by default (5)", () => {
    const slots = findAvailableSlots({
      existing: [],
      clinic: CLINIC,
      durationMinutes: 30,
      from: MON(9, 0),
    });
    expect(slots).toHaveLength(5);
  });

  it("respects maxSlots parameter", () => {
    const slots = findAvailableSlots({
      existing: [],
      clinic: CLINIC,
      durationMinutes: 30,
      from: MON(9, 0),
      maxSlots: 2,
    });
    expect(slots).toHaveLength(2);
  });

  it("first slot accounts for the 5-min buffer (rounds up to next 30-min mark)", () => {
    // from=09:00 + 5 min buffer → 09:05 → rounded up to 09:30
    const slots = findAvailableSlots({
      existing: [],
      clinic: CLINIC,
      durationMinutes: 30,
      from: MON(9, 0),
      maxSlots: 1,
    });
    expect(slots[0].getHours()).toBe(9);
    expect(slots[0].getMinutes()).toBe(30);
  });

  it("all returned slots fall within clinic opening hours", () => {
    const slots = findAvailableSlots({
      existing: [],
      clinic: CLINIC,
      durationMinutes: 30,
      from: MON(9, 0),
    });
    for (const slot of slots) {
      const slotMin = slot.getHours() * 60 + slot.getMinutes();
      expect(slotMin).toBeGreaterThanOrEqual(9 * 60);
      expect(slotMin + 30).toBeLessThanOrEqual(18 * 60);
    }
  });

  it("skips non-open days and jumps to next open day opening", () => {
    // Friday end of day → next slot should be Monday 09:00
    const slots = findAvailableSlots({
      existing: [],
      clinic: CLINIC,
      durationMinutes: 30,
      from: FRI(17, 35),
      maxSlots: 1,
    });
    expect(slots).toHaveLength(1);
    // Saturday and Sunday are not open → next is Monday
    expect(slots[0].getDay()).toBe(1); // Monday
    expect(slots[0].getHours()).toBe(9);
    expect(slots[0].getMinutes()).toBe(0);
  });

  it("skips slots where appointment end would exceed closing time", () => {
    // 60-min appointment starting at 17:30 would end 18:30 > 18:00
    const slots = findAvailableSlots({
      existing: [],
      clinic: CLINIC,
      durationMinutes: 60,
      from: MON(17, 25),
      maxSlots: 1,
    });
    expect(slots).toHaveLength(1);
    // Must start next open day at opening
    expect(slots[0].getHours()).toBe(9);
    expect(slots[0].getMinutes()).toBe(0);
    expect(slots[0].getDay()).toBe(2); // Tuesday
  });

  it("skips slots that conflict with existing appointments", () => {
    const existing = [
      {
        starts_at: new Date(2026, 0, 5, 9, 30).toISOString(),
        ends_at: new Date(2026, 0, 5, 10, 0).toISOString(),
      },
    ];
    const slots = findAvailableSlots({
      existing,
      clinic: CLINIC,
      durationMinutes: 30,
      from: MON(9, 0),
      maxSlots: 3,
    });
    const times = slots.map(
      (s) => `${s.getHours()}:${String(s.getMinutes()).padStart(2, "0")}`,
    );
    expect(times).not.toContain("9:30");
    // First available should be 10:00
    expect(times[0]).toBe("10:00");
  });

  it("handles overlapping conflict where slot start is before appointment end", () => {
    // Appointment 10:00–11:00; a 60-min slot at 09:30 would overlap (ends 10:30 > 10:00)
    const existing = [
      {
        starts_at: new Date(2026, 0, 5, 10, 0).toISOString(),
        ends_at: new Date(2026, 0, 5, 11, 0).toISOString(),
      },
    ];
    const slots = findAvailableSlots({
      existing,
      clinic: CLINIC,
      durationMinutes: 60,
      from: MON(9, 0),
      maxSlots: 1,
    });
    // 09:30 slot ends 10:30 which overlaps 10:00–11:00 → skip
    // 10:00 slot is conflict start exactly → also overlaps
    // 11:00 is first clear slot
    expect(slots[0].getHours()).toBe(11);
    expect(slots[0].getMinutes()).toBe(0);
  });

  it("treats durationMinutes=0 as 30 min", () => {
    const slots = findAvailableSlots({
      existing: [],
      clinic: CLINIC,
      durationMinutes: 0,
      from: MON(9, 0),
      maxSlots: 2,
    });
    expect(slots).toHaveLength(2);
  });

  it("returns empty array when clinic has no open days", () => {
    const closedClinic: TestClinic = { ...CLINIC, open_days: [] };
    const slots = findAvailableSlots({
      existing: [],
      clinic: closedClinic,
      durationMinutes: 30,
      from: MON(9, 0),
    });
    expect(slots).toHaveLength(0);
  });
});
