"use client";

import { type Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";

import { CALENDAR_COPY } from "@/copy/calendar-copy";
import {
  collectUniqueProfessionalColors,
  formatProfessionalSummary,
} from "@/lib/calendar-overlap-groups";
import { formatTime } from "@/lib/format";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { cn } from "@/lib/utils";
import type { AppointmentWithRelations } from "@/types/database.types";

type CalendarOverlapGroupEventProps = {
  calendarEvent: {
    start: Temporal.ZonedDateTime;
  };
  appointments: AppointmentWithRelations[];
};

function getEmployeeName(appointment: AppointmentWithRelations) {
  return appointment.employees?.full_name ?? null;
}

function getEmployeeColor(appointment: AppointmentWithRelations) {
  return appointment.employees?.color ?? null;
}

export default function CalendarOverlapGroupEvent({
  calendarEvent,
  appointments,
}: CalendarOverlapGroupEventProps) {
  const timezone = useActiveClinicTimezone();
  const startTime = formatTime(
    new Date(calendarEvent.start.epochMilliseconds),
    timezone,
  );
  const professionals = collectUniqueProfessionalColors(
    getEmployeeName,
    getEmployeeColor,
    appointments,
  );
  const summary = formatProfessionalSummary(
    professionals.map((professional) => professional.name),
  );
  const visibleProfessionals = professionals.slice(0, 3);

  return (
    <article className="flex h-full min-h-full w-full flex-col justify-center gap-1.5 overflow-hidden rounded-xl border border-primary/20 border-l-4 border-l-primary bg-primary-subtle px-2.5 py-1.5">
      <div className="flex items-center justify-between gap-2">
        <h3 className="m-0 truncate text-[12px] leading-tight font-semibold text-ink">
          {CALENDAR_COPY.week.groupTitle(startTime, appointments.length)}
        </h3>
        <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] leading-none font-bold text-on-primary">
          {appointments.length}
        </span>
      </div>
      {visibleProfessionals.length > 0 ? (
        <div className="sx-event-meta min-w-0 items-center gap-1.5">
          {visibleProfessionals.map((professional) => (
            <span
              key={professional.name}
              className={cn(
                "size-2 shrink-0 rounded-full",
                professional.color ? "" : "bg-border",
              )}
              style={
                professional.color
                  ? { backgroundColor: professional.color }
                  : undefined
              }
            />
          ))}
          {summary ? (
            <span className="truncate text-[11px] text-ink-secondary">
              {summary}
            </span>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
