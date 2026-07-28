"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";

import { calendarWeekUiRefs } from "@/components/calendar/calendar-week-ui-refs";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { cn } from "@/lib/utils";

export default function CalendarWeekGridDate({
  date,
}: {
  date: Temporal.PlainDate | string;
}) {
  const plain = typeof date === "string" ? Temporal.PlainDate.from(date) : date;
  const dateKey = plain.toString();
  const stats = calendarWeekUiRefs.dayStatsByKey.get(dateKey);
  const dayDate = new Date(plain.year, plain.month - 1, plain.day);
  const weekday = format(dayDate, "EEE", { locale: es });
  const dayNumber = format(dayDate, "d");
  const isBusy = Boolean(
    stats && !stats.isClosed && stats.occupancyPercent >= 80,
  );

  function handleClick() {
    calendarWeekUiRefs.navigateToDay(dayDate);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full flex-col items-center gap-0.5 px-2 py-3 text-center transition-colors hover:bg-canvas"
    >
      <strong
        className={cn(
          "text-sm font-semibold capitalize",
          isBusy ? "text-primary" : "text-ink",
        )}
      >
        {weekday} {dayNumber}
      </strong>
      {stats?.isClosed ? (
        <span className="text-xs text-ink-muted">
          {CALENDAR_COPY.week.closedDay}
        </span>
      ) : stats ? (
        <span className="text-xs text-ink-muted">
          {CALENDAR_COPY.week.daySummary(
            stats.appointmentCount,
            stats.occupancyPercent,
          )}
        </span>
      ) : null}
    </button>
  );
}
