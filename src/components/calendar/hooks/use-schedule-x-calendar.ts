"use client";

import {
  createViewDay,
  createViewMonthGrid,
  createViewWeek,
} from "@schedule-x/calendar";
import type { BackgroundEvent } from "@schedule-x/calendar";
import { createCalendarControlsPlugin } from "@schedule-x/calendar-controls";
import { createEventsServicePlugin } from "@schedule-x/events-service";
import { useNextCalendarApp } from "@schedule-x/react";
import {
  addDays,
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";

import CalendarEmptyHeader from "@/components/calendar/components/calendar-empty-header";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { CALENDAR_END_HOUR, CALENDAR_START_HOUR } from "@/lib/calendar-grid";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useClinicInfo } from "@/lib/hooks/use-clinic-info";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";
import { useEmployees } from "@/lib/hooks/use-employees";
import { buildEmployeeCalendars } from "@/lib/schedule-x-employee-calendars";
import {
  appointmentsKey,
  useAppointmentsStore,
} from "@/stores/appointments-store";
import {
  useCalendarStore,
  type CalendarViewMode,
} from "@/stores/calendar-store";
import type { AppointmentWithRelations } from "@/types/database.types";

// Preact's CSSProperties lacks an index signature, so we cast to allow CSS custom properties
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DIMMED_STYLE: any = {
  background: "var(--color-canvas)",
  opacity: 0.75,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CLOSED_DAY_STYLE: any = {
  background: "var(--color-canvas)",
  "--sx-label": '"Clínica cerrada"',
};

function isBlockedSlot(
  dateTime: Temporal.ZonedDateTime,
  clinic: ClinicInfo,
): boolean {
  if (!clinic.open_days.includes(dateTime.dayOfWeek)) return true;
  const hh = String(dateTime.hour).padStart(2, "0");
  const mm = String(dateTime.minute).padStart(2, "0");
  const time = `${hh}:${mm}`;
  return (
    time < clinic.opening_time.substring(0, 5) ||
    time >= clinic.closing_time.substring(0, 5)
  );
}

function parseHHMM(time: string): [number, number] {
  const parts = time.split(":");
  return [Number(parts[0]), Number(parts[1] ?? 0)];
}

function buildClinicBackgroundEvents(
  clinic: ClinicInfo,
  rangeStart: Date,
  rangeEnd: Date,
): BackgroundEvent[] {
  const tz = clinic.timezone;
  const [openH, openM] = parseHHMM(clinic.opening_time);
  const [closeH, closeM] = parseHHMM(clinic.closing_time);
  const events: BackgroundEvent[] = [];

  let current = startOfDay(rangeStart);
  while (current <= rangeEnd) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const day = current.getDate();
    const jsDay = current.getDay();
    const isoDay = jsDay === 0 ? 7 : jsDay;
    const isOpen = clinic.open_days.includes(isoDay);

    if (!isOpen) {
      // PlainDate: ScheduleX converts to 00:00–23:59 in the time grid (full coverage)
      // and picks it up as fullDayBackgroundEvent in the month grid
      events.push({
        start: Temporal.PlainDate.from({ year, month, day }),
        end: Temporal.PlainDate.from({ year, month, day }),
        style: CLOSED_DAY_STYLE,
      });
    } else {
      if (CALENDAR_START_HOUR * 60 < openH * 60 + openM) {
        events.push({
          start: Temporal.ZonedDateTime.from({
            year,
            month,
            day,
            hour: CALENDAR_START_HOUR,
            minute: 0,
            second: 0,
            timeZone: tz,
          }),
          end: Temporal.ZonedDateTime.from({
            year,
            month,
            day,
            hour: openH,
            minute: openM,
            second: 0,
            timeZone: tz,
          }),
          style: DIMMED_STYLE,
        });
      }
      if (closeH * 60 + closeM < CALENDAR_END_HOUR * 60) {
        events.push({
          start: Temporal.ZonedDateTime.from({
            year,
            month,
            day,
            hour: closeH,
            minute: closeM,
            second: 0,
            timeZone: tz,
          }),
          end: Temporal.ZonedDateTime.from({
            year,
            month,
            day,
            hour: CALENDAR_END_HOUR,
            minute: 0,
            second: 0,
            timeZone: tz,
          }),
          style: DIMMED_STYLE,
        });
      }
    }

    current = addDays(current, 1);
  }

  return events;
}

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
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const viewMode = useCalendarStore((state) => state.viewMode);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const openCreateDialog = useCalendarStore((state) => state.openCreateDialog);
  const openEditDialog = useCalendarStore((state) => state.openEditDialog);
  const setVisibleRange = useCalendarStore((state) => state.setVisibleRange);
  const { clinic } = useClinicInfo();

  const { start: rangeStart, end: rangeEnd } = getRangeForViewMode(
    viewMode,
    weekAnchor,
  );

  const rangeStartIso = rangeStart.toISOString();
  const rangeEndIso = rangeEnd.toISOString();

  const backgroundEvents = useMemo(
    () =>
      clinic ? buildClinicBackgroundEvents(clinic, rangeStart, rangeEnd) : [],
    // rangeStartIso/rangeEndIso are stable string deps for Date objects
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clinic, rangeStartIso, rangeEndIso],
  );

  const appointments = useAppointments(
    { start: rangeStart, end: rangeEnd },
    employeeId,
  );
  const employees = useEmployees();

  const employeeCalendars = useMemo(() => {
    const byId = new Map<
      string,
      { id: string; full_name: string; color: string | null }
    >();

    for (const employee of employees.data ?? []) {
      byId.set(employee.id, employee);
    }

    for (const appointment of appointments.data ?? []) {
      if (!appointment.employees) {
        continue;
      }

      if (byId.has(appointment.employee_id)) {
        continue;
      }

      byId.set(appointment.employee_id, {
        id: appointment.employee_id,
        full_name: appointment.employees.full_name,
        color: appointment.employees.color,
      });
    }

    return buildEmployeeCalendars([...byId.values()]);
  }, [appointments.data, employees.data]);

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

  const openCreateDialogRef = useRef(openCreateDialog);
  const openEditDialogRef = useRef(openEditDialog);
  const setVisibleRangeRef = useRef(setVisibleRange);
  const clinicRef = useRef(clinic);
  const syncedWeekAnchorRef = useRef(initialConfig.weekAnchor);

  useEffect(() => {
    openCreateDialogRef.current = openCreateDialog;
    openEditDialogRef.current = openEditDialog;
    setVisibleRangeRef.current = setVisibleRange;
    clinicRef.current = clinic;
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
    calendars: {},
    backgroundEvents,
    plugins: [eventsService, calendarControls],
    skipAnimations: true,
    callbacks: {
      onEventClick: (event) => {
        openEditDialogRef.current(String(event.id));
      },
      onClickDateTime: (dateTime) => {
        const c = clinicRef.current;
        if (c && isBlockedSlot(dateTime, c)) return;
        openCreateDialogRef.current(zonedDateTimeToDate(dateTime));
      },
      onClickDate: (dateString) => {
        const c = clinicRef.current;
        // ScheduleX passes a Temporal.PlainDate at runtime despite the string type
        const plain =
          typeof dateString === "string"
            ? Temporal.PlainDate.from(dateString)
            : (dateString as unknown as Temporal.PlainDate);
        if (c && !c.open_days.includes(plain.dayOfWeek)) return;
        openCreateDialogRef.current(
          new Date(plain.year, plain.month - 1, plain.day),
        );
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
    if (!calendarApp) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const calendarsSignal = (calendarApp as any).$app?.config?.calendars;
    if (!calendarsSignal) return;
    // ScheduleX exposes calendars as an internal Preact Signal with no public setter
    // eslint-disable-next-line react-hooks/immutability
    calendarsSignal.value = employeeCalendars;
  }, [calendarApp, employeeCalendars]);

  useEffect(() => {
    if (!calendarApp) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bgSignal = (calendarApp as any).$app?.calendarEvents
      ?.backgroundEvents;
    if (!bgSignal) return;
    // ScheduleX exposes background events as an internal Preact Signal with no public setter
    // eslint-disable-next-line react-hooks/immutability
    bgSignal.value = backgroundEvents;
  }, [calendarApp, backgroundEvents]);

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
