import { describe, expect, it } from "vitest";

import {
  CALENDAR_END_HOUR,
  CALENDAR_START_HOUR,
  SLOT_HEIGHT,
  SLOT_MINUTES,
  appointmentLayout,
  formatDayHeader,
  formatMonthLabel,
  formatWeekRange,
  getAgendaHours,
  getMonthGridDays,
  getNowIndicatorOffset,
  getWeekDays,
  getWeekRange,
  isDayInWeek,
  layoutOverlappingAppointments,
  minutesToOffset,
  slotFromY,
} from "@/lib/calendar-grid";

// 2026-01-07 is a Wednesday; use it as a mid-week anchor
const WED = new Date(2026, 0, 7, 12, 0, 0, 0);

describe("getWeekDays", () => {
  it("always returns 7 days", () => {
    expect(getWeekDays(WED)).toHaveLength(7);
  });

  it("starts on Monday regardless of anchor day", () => {
    const days = getWeekDays(WED);
    expect(days[0].getDay()).toBe(1); // Monday
  });

  it("ends on Sunday", () => {
    const days = getWeekDays(WED);
    expect(days[6].getDay()).toBe(0); // Sunday
  });

  it("includes the anchor date", () => {
    const days = getWeekDays(WED);
    const hasWed = days.some(
      (d) => d.getDate() === WED.getDate() && d.getMonth() === WED.getMonth(),
    );
    expect(hasWed).toBe(true);
  });
});

describe("getWeekRange", () => {
  it("start is midnight of the Monday", () => {
    const { start } = getWeekRange(WED);
    expect(start.getDay()).toBe(1);
    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getSeconds()).toBe(0);
  });

  it("end is 23:59:59.999 of the Sunday", () => {
    const { end } = getWeekRange(WED);
    expect(end.getDay()).toBe(0);
    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
  });
});

describe("getMonthGridDays", () => {
  it("returns a multiple of 7 (complete weeks)", () => {
    const days = getMonthGridDays(WED);
    expect(days.length % 7).toBe(0);
  });

  it("first day is a Monday", () => {
    const days = getMonthGridDays(WED);
    expect(days[0].getDay()).toBe(1);
  });

  it("last day is a Sunday", () => {
    const days = getMonthGridDays(WED);
    expect(days[days.length - 1].getDay()).toBe(0);
  });

  it("covers all days of the month", () => {
    const days = getMonthGridDays(WED); // January 2026
    const januaryDays = days.filter((d) => d.getMonth() === 0);
    expect(januaryDays).toHaveLength(31);
  });
});

describe("getAgendaHours", () => {
  it("starts at CALENDAR_START_HOUR", () => {
    const hours = getAgendaHours();
    expect(hours[0]).toBe(CALENDAR_START_HOUR);
  });

  it("ends at CALENDAR_END_HOUR - 1", () => {
    const hours = getAgendaHours();
    expect(hours[hours.length - 1]).toBe(CALENDAR_END_HOUR - 1);
  });

  it("has CALENDAR_END_HOUR - CALENDAR_START_HOUR entries", () => {
    expect(getAgendaHours()).toHaveLength(
      CALENDAR_END_HOUR - CALENDAR_START_HOUR,
    );
  });
});

describe("minutesToOffset", () => {
  it("0 minutes → 0px", () => {
    expect(minutesToOffset(0)).toBe(0);
  });

  it("SLOT_MINUTES → SLOT_HEIGHT px", () => {
    expect(minutesToOffset(SLOT_MINUTES)).toBe(SLOT_HEIGHT);
  });

  it("60 minutes → SLOT_HEIGHT * 2 px", () => {
    expect(minutesToOffset(60)).toBe(SLOT_HEIGHT * 2);
  });
});

describe("appointmentLayout", () => {
  const day = new Date(2026, 0, 5); // Monday

  it("returns correct top and height for appointment within the day", () => {
    const startsAt = new Date(2026, 0, 5, CALENDAR_START_HOUR + 1, 0); // 09:00
    const endsAt = new Date(2026, 0, 5, CALENDAR_START_HOUR + 2, 0); // 10:00
    const layout = appointmentLayout(startsAt, endsAt, day);
    expect(layout).not.toBeNull();
    expect(layout!.top).toBe(minutesToOffset(60)); // 1h from start
    expect(layout!.height).toBe(minutesToOffset(60));
  });

  it("returns null for appointment entirely before calendar start", () => {
    const startsAt = new Date(2026, 0, 5, 6, 0);
    const endsAt = new Date(2026, 0, 5, 7, 0);
    expect(appointmentLayout(startsAt, endsAt, day)).toBeNull();
  });

  it("returns null for appointment entirely after calendar end", () => {
    const startsAt = new Date(2026, 0, 5, CALENDAR_END_HOUR + 1, 0);
    const endsAt = new Date(2026, 0, 5, CALENDAR_END_HOUR + 2, 0);
    expect(appointmentLayout(startsAt, endsAt, day)).toBeNull();
  });

  it("clips appointment that starts before calendar start", () => {
    const startsAt = new Date(2026, 0, 5, CALENDAR_START_HOUR - 1, 0);
    const endsAt = new Date(2026, 0, 5, CALENDAR_START_HOUR + 1, 0);
    const layout = appointmentLayout(startsAt, endsAt, day);
    expect(layout).not.toBeNull();
    expect(layout!.top).toBe(0); // clipped to start
  });
});

describe("slotFromY", () => {
  it("y=0 returns calendar start hour", () => {
    const day = new Date(2026, 0, 5);
    const slot = slotFromY(0, day);
    expect(slot.getHours()).toBe(CALENDAR_START_HOUR);
    expect(slot.getMinutes()).toBe(0);
  });

  it("y=SLOT_HEIGHT returns second slot (30 min later)", () => {
    const day = new Date(2026, 0, 5);
    const slot = slotFromY(SLOT_HEIGHT, day);
    expect(slot.getHours()).toBe(CALENDAR_START_HOUR);
    expect(slot.getMinutes()).toBe(SLOT_MINUTES);
  });

  it("non-finite y defaults to 0", () => {
    const day = new Date(2026, 0, 5);
    const slot = slotFromY(NaN, day);
    expect(slot.getHours()).toBe(CALENDAR_START_HOUR);
    expect(slot.getMinutes()).toBe(0);
  });
});

describe("getNowIndicatorOffset", () => {
  it("returns null for time before calendar start", () => {
    const before = new Date(2026, 0, 5, CALENDAR_START_HOUR - 1, 0);
    expect(getNowIndicatorOffset(before)).toBeNull();
  });

  it("returns null for time at or after calendar end", () => {
    const after = new Date(2026, 0, 5, CALENDAR_END_HOUR, 0);
    expect(getNowIndicatorOffset(after)).toBeNull();
  });

  it("returns a positive offset for time within calendar hours", () => {
    const midDay = new Date(2026, 0, 5, CALENDAR_START_HOUR + 2, 0);
    const offset = getNowIndicatorOffset(midDay);
    expect(offset).not.toBeNull();
    expect(offset!).toBeGreaterThan(0);
  });
});

describe("isDayInWeek", () => {
  it("returns true for a day that is in the anchor week", () => {
    const monday = new Date(2026, 0, 5);
    expect(isDayInWeek(monday, WED)).toBe(true);
  });

  it("returns false for a day outside the anchor week", () => {
    const nextMonday = new Date(2026, 0, 12);
    expect(isDayInWeek(nextMonday, WED)).toBe(false);
  });
});

describe("formatMonthLabel", () => {
  it("capitalizes the first letter", () => {
    const label = formatMonthLabel(WED);
    expect(label.charAt(0)).toBe(label.charAt(0).toUpperCase());
  });

  it("includes the year", () => {
    expect(formatMonthLabel(WED)).toContain("2026");
  });
});

describe("formatWeekRange", () => {
  it("returns a string with an em dash for multi-day ranges", () => {
    expect(formatWeekRange(WED)).toContain("–");
  });

  it("starts with a capital letter", () => {
    const label = formatWeekRange(WED);
    expect(label.charAt(0)).toBe(label.charAt(0).toUpperCase());
  });
});

describe("formatDayHeader", () => {
  it("returns an uppercase weekday abbreviation", () => {
    const { weekday } = formatDayHeader(WED);
    expect(weekday).toBe(weekday.toUpperCase());
  });

  it("returns the correct day number", () => {
    const { dayNumber } = formatDayHeader(WED);
    expect(dayNumber).toBe("7");
  });
});

describe("layoutOverlappingAppointments", () => {
  it("non-overlapping appointments each get columnCount=1", () => {
    const appts = [
      {
        id: "a",
        starts_at: "2026-01-05T09:00:00",
        ends_at: "2026-01-05T10:00:00",
      },
      {
        id: "b",
        starts_at: "2026-01-05T11:00:00",
        ends_at: "2026-01-05T12:00:00",
      },
    ];
    const layout = layoutOverlappingAppointments(appts);
    expect(layout.get("a")!.columnCount).toBe(1);
    expect(layout.get("b")!.columnCount).toBe(1);
  });

  it("two overlapping appointments get columnCount=2 and distinct column indices", () => {
    const appts = [
      {
        id: "a",
        starts_at: "2026-01-05T09:00:00",
        ends_at: "2026-01-05T10:30:00",
      },
      {
        id: "b",
        starts_at: "2026-01-05T09:30:00",
        ends_at: "2026-01-05T11:00:00",
      },
    ];
    const layout = layoutOverlappingAppointments(appts);
    expect(layout.get("a")!.columnCount).toBe(2);
    expect(layout.get("b")!.columnCount).toBe(2);
    expect(layout.get("a")!.columnIndex).not.toBe(layout.get("b")!.columnIndex);
  });

  it("returns empty map for empty input", () => {
    expect(layoutOverlappingAppointments([])).toEqual(new Map());
  });
});
