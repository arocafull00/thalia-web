"use client";

import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { useNextCalendarApp } from "@schedule-x/react";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";

import CalendarEmptyHeader from "@/components/calendar/components/calendar-empty-header";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { CALENDAR_END_HOUR, CALENDAR_START_HOUR } from "@/lib/calendar-grid";
import { useAppointments } from "@/lib/hooks/use-appointments";
import {
  appointmentsKey,
  useAppointmentsStore,
} from "@/stores/appointments-store";
import {
  useCalendarStore,
  type CalendarViewMode,
} from "@/stores/calendar-store";
import type { AppointmentWithRelations } from "@/types/database.types";

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

function toDateOnlyIso(value: unknown) {
  const raw = String(value);
  return raw.split("T")[0].split("[")[0];
}

function getRangeForViewMode(viewMode: CalendarViewMode, anchor: Date) {
  if (viewMode === "month") {
    return { start: startOfMonth(anchor), end: endOfMonth(anchor) };
  }
  if (viewMode === "day") {
    return { start: startOfDay(anchor), end: endOfDay(anchor) };
  }
  return {
    start: startOfWeek(anchor, { weekStartsOn: 1 }),
    end: endOfWeek(anchor, { weekStartsOn: 1 }),
  };
}

function buildScheduleEvents(
  data: AppointmentWithRelations[] | null | undefined,
) {
  return (data ?? []).map((appointment) => ({
    id: appointment.id,
    title: `${appointment.patients?.full_name ?? CALENDAR_COPY.event.defaultPatient} · ${
      appointment.appointment_treatments[0]?.treatment?.name ??
      CALENDAR_COPY.event.defaultTreatment
    }`,
    start: toZonedDateTime(appointment.starts_at),
    end: toZonedDateTime(appointment.ends_at),
    calendarId: appointment.employee_id,
  }));
}

function getInitialCalendarConfig() {
  const { weekAnchor, employeeId, viewMode } = useCalendarStore.getState();
  const { start: rangeStart, end: rangeEnd } = getRangeForViewMode(
    viewMode,
    weekAnchor,
  );
  const key = appointmentsKey(
    rangeStart.toISOString(),
    rangeEnd.toISOString(),
    employeeId,
  );
  const entry = useAppointmentsStore.getState().byRange[key];

  return {
    selectedDate: toPlainDate(weekAnchor),
    events: buildScheduleEvents(entry?.data),
    weekAnchor: toPlainDate(weekAnchor).toString(),
    viewMode,
  };
}

export function useScheduleXCalendar(gridHeight: number) {
  const router = useRouter();
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const viewMode = useCalendarStore((state) => state.viewMode);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const openCreateDialog = useCalendarStore((state) => state.openCreateDialog);
  const setVisibleRange = useCalendarStore((state) => state.setVisibleRange);

  const { start: rangeStart, end: rangeEnd } = getRangeForViewMode(
    viewMode,
    weekAnchor,
  );

  const appointments = useAppointments(
    { start: rangeStart, end: rangeEnd },
    employeeId,
  );

  const eventsService = useState(() => createEventsServicePlugin())[0];
  const calendarControls = useState(() => createCalendarControlsPlugin())[0];
  const dayView = useState(() => createViewDay())[0];
  const weekView = useState(() => createViewWeek())[0];
  const monthView = useState(() => createViewMonthGrid())[0];
  const customComponents = useState(() => ({
    headerContent: CalendarEmptyHeader,
  }))[0];
  const [initialConfig] = useState(getInitialCalendarConfig);

  const scheduleEvents = useMemo(
    () => buildScheduleEvents(appointments.data),
    [appointments.data],
  );

  const routerRef = useRef(router);
  const openCreateDialogRef = useRef(openCreateDialog);
  const setVisibleRangeRef = useRef(setVisibleRange);
  const syncedWeekAnchorRef = useRef(initialConfig.weekAnchor);

  useEffect(() => {
    routerRef.current = router;
    openCreateDialogRef.current = openCreateDialog;
    setVisibleRangeRef.current = setVisibleRange;
  });

  function pushVisibleRange() {
    const range = calendarControls.getRange();
    if (range) {
      setVisibleRangeRef.current(
        toDateOnlyIso(range.start),
        toDateOnlyIso(range.end),
      );
    }
  }

  function viewNameFor(mode: CalendarViewMode) {
    if (mode === "month") return monthView.name;
    if (mode === "day") return dayView.name;
    return weekView.name;
  }

  const calendarApp = useNextCalendarApp({
    views: [dayView, weekView, monthView],
    defaultView: viewNameFor(initialConfig.viewMode),
    locale: "es-ES",
    firstDayOfWeek: 1,
    isResponsive: false,
    weekOptions: {
      nDays: 7,
      gridHeight,
    },
    selectedDate: initialConfig.selectedDate,
    dayBoundaries: {
      start: `${String(CALENDAR_START_HOUR).padStart(2, "0")}:00`,
      end: `${String(CALENDAR_END_HOUR).padStart(2, "0")}:00`,
    },
    events: initialConfig.events,
    plugins: [eventsService, calendarControls],
    skipAnimations: true,
    callbacks: {
      onEventClick: (event) => {
        routerRef.current.push(`/appointments/${String(event.id)}`);
      },
      onClickDateTime: (dateTime) => {
        openCreateDialogRef.current(zonedDateTimeToDate(dateTime));
      },
      onClickDate: (dateString) => {
        openCreateDialogRef.current(new Date(dateString));
      },
      onRangeUpdate: ({ start, end }) => {
        setVisibleRangeRef.current(toDateOnlyIso(start), toDateOnlyIso(end));
      },
    },
  });

  useEffect(() => {
    if (!calendarApp) return;

    eventsService.set(scheduleEvents);
  }, [calendarApp, eventsService, scheduleEvents]);

  useEffect(() => {
    if (!appointments.error) return;

    toast.error(CALENDAR_COPY.event.loadError);
  }, [appointments.error]);

  useEffect(() => {
    if (!calendarApp) return;
    pushVisibleRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarApp]);

  useEffect(() => {
    if (!calendarApp) return;

    const nextDate = toPlainDate(weekAnchor).toString();
    if (nextDate === syncedWeekAnchorRef.current) {
      return;
    }

    syncedWeekAnchorRef.current = nextDate;
    calendarControls.setDate(toPlainDate(weekAnchor));
    pushVisibleRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calendarApp, calendarControls, weekAnchor]);

  useEffect(() => {
    if (!calendarApp) return;

    if (viewMode === "month") {
      calendarControls.setView(monthView.name);
      pushVisibleRange();
      return;
    }

    calendarControls.setView(viewMode === "day" ? dayView.name : weekView.name);
    calendarControls.setDate(toPlainDate(weekAnchor));
    pushVisibleRange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    calendarApp,
    calendarControls,
    dayView.name,
    monthView.name,
    viewMode,
    weekView.name,
  ]);

  return {
    calendarApp,
    customComponents,
    isLoading: appointments.isLoading,
  };
}
