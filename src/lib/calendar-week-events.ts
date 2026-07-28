import { format } from "date-fns";
import { Temporal } from "temporal-polyfill";

import { CALENDAR_COPY } from "@/copy/calendar-copy";
import {
  groupOverlappingAppointmentsByDay,
  type OverlapGroup,
} from "@/lib/calendar-overlap-groups";
import type { AppointmentWithRelations } from "@/types/database.types";

export type ScheduleXCalendarEvent = {
  id: string;
  title: string;
  start: Temporal.ZonedDateTime;
  end: Temporal.ZonedDateTime;
  calendarId: string;
};

export type WeekScheduleEventsResult = {
  events: ScheduleXCalendarEvent[];
  groupAppointmentsById: Map<string, AppointmentWithRelations[]>;
};

function toZonedDateTime(iso: string) {
  return Temporal.Instant.from(iso).toZonedDateTimeISO(
    Temporal.Now.timeZoneId(),
  );
}

function toZonedDateTimeFromMs(ms: number) {
  return Temporal.Instant.fromEpochMilliseconds(ms).toZonedDateTimeISO(
    Temporal.Now.timeZoneId(),
  );
}

function getDayKey(startsAt: string) {
  return format(new Date(startsAt), "yyyy-MM-dd");
}

function buildSingleEvent(
  appointment: AppointmentWithRelations,
): ScheduleXCalendarEvent {
  return {
    id: appointment.id,
    title: `${appointment.patients?.full_name ?? CALENDAR_COPY.event.defaultPatient} · ${
      appointment.appointment_treatments[0]?.treatment?.name ??
      CALENDAR_COPY.event.defaultTreatment
    }`,
    start: toZonedDateTime(appointment.starts_at),
    end: toZonedDateTime(appointment.ends_at),
    calendarId: appointment.employee_id,
  };
}

function buildGroupEvent(
  group: OverlapGroup<AppointmentWithRelations>,
): ScheduleXCalendarEvent {
  const startTime = format(new Date(group.startMs), "HH:mm");

  return {
    id: group.id,
    title: CALENDAR_COPY.week.groupTitle(startTime, group.appointments.length),
    start: toZonedDateTimeFromMs(group.startMs),
    end: toZonedDateTimeFromMs(group.endMs),
    calendarId: "overlap-group",
  };
}

export function buildWeekScheduleEvents(
  data: AppointmentWithRelations[] | null | undefined,
): WeekScheduleEventsResult {
  const appointments = data ?? [];
  const partition = groupOverlappingAppointmentsByDay(
    appointments,
    (appointment) => getDayKey(appointment.starts_at),
  );

  const groupAppointmentsById = new Map<string, AppointmentWithRelations[]>();

  for (const group of partition.groups) {
    groupAppointmentsById.set(group.id, group.appointments);
  }

  const events: ScheduleXCalendarEvent[] = [
    ...partition.singles.map(buildSingleEvent),
    ...partition.groups.map(buildGroupEvent),
  ];

  return { events, groupAppointmentsById };
}

export function buildIndividualScheduleEvents(
  data: AppointmentWithRelations[] | null | undefined,
): ScheduleXCalendarEvent[] {
  return (data ?? []).map(buildSingleEvent);
}
