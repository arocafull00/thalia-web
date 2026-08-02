import { Temporal } from "temporal-polyfill";

import { CALENDAR_COPY } from "@/copy/calendar-copy";
import {
  formatClinicDayKey,
  instantToClinicZonedDateTime,
} from "@/lib/appointment-datetime";
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

function toZonedDateTime(iso: string, timezone: string) {
  return instantToClinicZonedDateTime(iso, timezone);
}

function toZonedDateTimeFromMs(ms: number, timezone: string) {
  return Temporal.Instant.fromEpochMilliseconds(ms).toZonedDateTimeISO(
    timezone,
  );
}

function buildSingleEvent(
  appointment: AppointmentWithRelations,
  timezone: string,
): ScheduleXCalendarEvent {
  return {
    id: appointment.id,
    title: `${appointment.patients?.full_name ?? CALENDAR_COPY.event.defaultPatient} · ${
      appointment.appointment_treatments[0]?.treatment?.name ??
      CALENDAR_COPY.event.defaultTreatment
    }`,
    start: toZonedDateTime(appointment.starts_at, timezone),
    end: toZonedDateTime(appointment.ends_at, timezone),
    calendarId: appointment.employee_id,
  };
}

function buildGroupEvent(
  group: OverlapGroup<AppointmentWithRelations>,
  timezone: string,
): ScheduleXCalendarEvent {
  const start = toZonedDateTimeFromMs(group.startMs, timezone);
  const startTime = `${String(start.hour).padStart(2, "0")}:${String(start.minute).padStart(2, "0")}`;

  return {
    id: group.id,
    title: CALENDAR_COPY.week.groupTitle(startTime, group.appointments.length),
    start,
    end: toZonedDateTimeFromMs(group.endMs, timezone),
    calendarId: "overlap-group",
  };
}

export function buildWeekScheduleEvents(
  data: AppointmentWithRelations[] | null | undefined,
  timezone: string,
): WeekScheduleEventsResult {
  const appointments = data ?? [];
  const partition = groupOverlappingAppointmentsByDay(
    appointments,
    (appointment) => formatClinicDayKey(appointment.starts_at, timezone),
  );

  const groupAppointmentsById = new Map<string, AppointmentWithRelations[]>();

  for (const group of partition.groups) {
    groupAppointmentsById.set(group.id, group.appointments);
  }

  const events: ScheduleXCalendarEvent[] = [
    ...partition.singles.map((appointment) =>
      buildSingleEvent(appointment, timezone),
    ),
    ...partition.groups.map((group) => buildGroupEvent(group, timezone)),
  ];

  return { events, groupAppointmentsById };
}

export function buildIndividualScheduleEvents(
  data: AppointmentWithRelations[] | null | undefined,
  timezone: string,
): ScheduleXCalendarEvent[] {
  return (data ?? []).map((appointment) =>
    buildSingleEvent(appointment, timezone),
  );
}
