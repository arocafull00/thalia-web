"use client";

import { useEffect, useRef } from "react";
import { createCalendar, viewWeek } from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import { Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";

type ScheduleXEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  calendarId?: string;
};

type ScheduleXCalendarProps = {
  weekAnchor: Date;
  events: ScheduleXEvent[];
  onEventClick: (eventId: string) => void;
};

function toPlainDate(date: Date) {
  return Temporal.PlainDate.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

function toZonedDateTime(iso: string) {
  return Temporal.Instant.from(iso).toZonedDateTimeISO(Temporal.Now.timeZoneId());
}

export default function ScheduleXCalendar({
  weekAnchor,
  events,
  onEventClick,
}: ScheduleXCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onEventClickRef = useRef(onEventClick);

  useEffect(() => {
    onEventClickRef.current = onEventClick;
  }, [onEventClick]);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const calendar = createCalendar({
      views: [viewWeek],
      defaultView: viewWeek.name,
      selectedDate: toPlainDate(weekAnchor),
      events: events.map((event) => ({
        id: event.id,
        title: event.title,
        start: toZonedDateTime(event.start),
        end: toZonedDateTime(event.end),
        calendarId: event.calendarId,
      })),
      callbacks: {
        onEventClick: (event) => {
          onEventClickRef.current(String(event.id));
        },
      },
    });

    calendar.render(containerRef.current);

    return () => {
      calendar.destroy();
    };
  }, [weekAnchor, events]);

  return <div ref={containerRef} className="h-full w-full sx-calendar" />;
}
