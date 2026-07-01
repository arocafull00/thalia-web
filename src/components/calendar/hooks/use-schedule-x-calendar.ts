"use client";

import { createViewWeek } from "@schedule-x/calendar";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { useNextCalendarApp } from "@schedule-x/react";
import { endOfWeek, startOfWeek } from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";

import CalendarEmptyHeader from "@/components/calendar/components/calendar-empty-header";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { CALENDAR_END_HOUR, CALENDAR_START_HOUR } from "@/lib/calendar-grid";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useCalendarStore } from "@/stores/calendar-store";

function toPlainDate(date: Date) {
  return Temporal.PlainDate.from({
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  });
}

function toZonedDateTime(iso: string) {
  return Temporal.Instant.from(iso).toZonedDateTimeISO(
    Temporal.Now.timeZoneId(),
  );
}

function zonedDateTimeToDate(dateTime: Temporal.ZonedDateTime) {
  return new Date(dateTime.epochMilliseconds);
}

export function useScheduleXCalendar() {
  const router = useRouter();
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const openCreateDialog = useCalendarStore((state) => state.openCreateDialog);

  const rangeStart = startOfWeek(weekAnchor, { weekStartsOn: 1 });
  const rangeEnd = endOfWeek(weekAnchor, { weekStartsOn: 1 });
  const appointments = useAppointments(
    { start: rangeStart, end: rangeEnd },
    employeeId,
  );

  const eventsService = useState(() => createEventsServicePlugin())[0];
  const calendarControls = useState(() => createCalendarControlsPlugin())[0];

  const routerRef = useRef(router);
  const openCreateDialogRef = useRef(openCreateDialog);

  useEffect(() => {
    routerRef.current = router;
    openCreateDialogRef.current = openCreateDialog;
  });

  const weekView = createViewWeek();

  const calendarApp = useNextCalendarApp({
    views: [weekView],
    defaultView: weekView.name,
    locale: "es-ES",
    firstDayOfWeek: 1,
    selectedDate: toPlainDate(weekAnchor),
    dayBoundaries: {
      start: `${String(CALENDAR_START_HOUR).padStart(2, "0")}:00`,
      end: `${String(CALENDAR_END_HOUR).padStart(2, "0")}:00`,
    },
    events: [],
    plugins: [eventsService, calendarControls],
    skipAnimations: true,
    callbacks: {
      onEventClick: (event) => {
        routerRef.current.push(`/appointments/${String(event.id)}`);
      },
      onClickDateTime: (dateTime) => {
        openCreateDialogRef.current(zonedDateTimeToDate(dateTime));
      },
      onRender: (app) => {
        app.config.skipAnimations = false;
      },
    },
  });

  const scheduleEvents = useMemo(
    () =>
      (appointments.data ?? []).map((appointment) => ({
        id: appointment.id,
        title: `${appointment.patients?.full_name ?? CALENDAR_COPY.event.defaultPatient} · ${
          appointment.appointment_treatments[0]?.treatment_types?.name ??
          CALENDAR_COPY.event.defaultTreatment
        }`,
        start: toZonedDateTime(appointment.starts_at),
        end: toZonedDateTime(appointment.ends_at),
        calendarId: appointment.employee_id,
      })),
    [appointments.data],
  );

  useEffect(() => {
    eventsService.set(scheduleEvents);
  }, [eventsService, scheduleEvents]);

  useEffect(() => {
    calendarControls.setDate(toPlainDate(weekAnchor));
  }, [calendarControls, weekAnchor]);

  return {
    calendarApp,
    customComponents: { headerContent: CalendarEmptyHeader },
  };
}
