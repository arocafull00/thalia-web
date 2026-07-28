"use client";

import { type Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";

import { calendarWeekUiRefs } from "@/components/calendar/calendar-week-ui-refs";
import CalendarOverlapGroupEvent from "@/components/calendar/components/calendar-overlap-group-event";
import { isOverlapGroupEventId } from "@/lib/calendar-overlap-groups";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

type CalendarEventProps = {
  calendarEvent: {
    id: string | number;
    title: string;
    start: Temporal.ZonedDateTime;
    end: Temporal.ZonedDateTime;
    calendarId?: string;
  };
};

export default function CalendarTimeGridEvent({
  calendarEvent,
}: CalendarEventProps) {
  const eventId = String(calendarEvent.id);

  if (isOverlapGroupEventId(eventId)) {
    const appointments =
      calendarWeekUiRefs.groupAppointmentsById.get(eventId) ?? [];
    return (
      <CalendarOverlapGroupEvent
        calendarEvent={calendarEvent}
        appointments={appointments}
      />
    );
  }

  const start = new Date(calendarEvent.start.epochMilliseconds);
  const end = new Date(calendarEvent.end.epochMilliseconds);
  const [patientPart, treatmentPart] = calendarEvent.title.split(" · ");
  const appointment = calendarWeekUiRefs.appointmentsById.get(eventId);
  const employeeName = appointment?.employees?.full_name;
  const employeeColor = appointment?.employees?.color;

  return (
    <div
      className={cn(
        "flex h-full min-h-full flex-col justify-center gap-0.5 overflow-hidden rounded-xl border border-border-subtle border-l-4 bg-surface px-2.5 py-1",
        employeeColor ? "" : "border-l-border",
      )}
      style={
        employeeColor ? { borderInlineStartColor: employeeColor } : undefined
      }
    >
      <strong className="truncate text-[12px] leading-tight font-semibold text-ink">
        {patientPart}
        {treatmentPart ? ` · ${treatmentPart}` : ""}
      </strong>
      <small className="sx-event-meta truncate text-[11px] leading-tight text-ink-muted">
        {formatTime(start)}–{formatTime(end)}
        {employeeName ? ` · ${employeeName}` : ""}
      </small>
    </div>
  );
}
