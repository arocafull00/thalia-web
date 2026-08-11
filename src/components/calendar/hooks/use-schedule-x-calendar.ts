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
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Temporal } from "temporal-polyfill";
import "temporal-polyfill/global";

import {
  calendarWeekUiRefs,
  updateCalendarWeekUiRefs,
} from "@/components/calendar/calendar-week-ui-refs";
import CalendarEmptyHeader from "@/components/calendar/components/calendar-empty-header";
import CalendarTimeGridEvent from "@/components/calendar/components/calendar-time-grid-event";
import CalendarWeekGridDate from "@/components/calendar/components/calendar-week-grid-date";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import { getClinicRangeIso } from "@/lib/appointment-datetime";
import { computeDayStatsForRange } from "@/lib/calendar-day-stats";
import {
  getClinicCalendarHourRange,
  getMinWeekGridHeight,
  getWeekDays,
  parseCalendarTimeToMinutes,
  roundToNearestSlot,
  type CalendarHourRange,
} from "@/lib/calendar-grid";
import { isOverlapGroupEventId } from "@/lib/calendar-overlap-groups";
import {
  buildIndividualScheduleEvents,
  buildWeekScheduleEvents,
} from "@/lib/calendar-week-events";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { useAppointments } from "@/lib/hooks/use-appointments";
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

function zonedDateTimeAtMinute(
  year: number,
  month: number,
  day: number,
  minuteOfDay: number,
  timeZone: string,
) {
  const dayStart = Temporal.ZonedDateTime.from({
    year,
    month,
    day,
    hour: 0,
    minute: 0,
    second: 0,
    timeZone,
  });

  if (minuteOfDay === 24 * 60) {
    return dayStart.add({ days: 1 });
  }

  return dayStart.add({ minutes: minuteOfDay });
}

function buildClinicBackgroundEvents(
  clinic: ClinicInfo,
  hourRange: CalendarHourRange,
  rangeStart: Date,
  rangeEnd: Date,
): BackgroundEvent[] {
  const tz = clinic.timezone;
  const openingMinutes = parseCalendarTimeToMinutes(clinic.opening_time);
  const closingMinutes = parseCalendarTimeToMinutes(clinic.closing_time);
  const hasValidHours =
    openingMinutes !== null &&
    closingMinutes !== null &&
    openingMinutes < closingMinutes;
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
    } else if (hasValidHours) {
      if (hourRange.startHour * 60 < openingMinutes) {
        events.push({
          start: zonedDateTimeAtMinute(
            year,
            month,
            day,
            hourRange.startHour * 60,
            tz,
          ),
          end: zonedDateTimeAtMinute(year, month, day, openingMinutes, tz),
          style: DIMMED_STYLE,
        });
      }
      if (closingMinutes < hourRange.endHour * 60) {
        events.push({
          start: zonedDateTimeAtMinute(year, month, day, closingMinutes, tz),
          end: zonedDateTimeAtMinute(
            year,
            month,
            day,
            hourRange.endHour * 60,
            tz,
          ),
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

function zonedDateTimeToWallDate(dateTime: Temporal.ZonedDateTime) {
  return new Date(
    dateTime.year,
    dateTime.month - 1,
    dateTime.day,
    dateTime.hour,
    dateTime.minute,
    dateTime.second,
    dateTime.millisecond,
  );
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

function buildScheduleEventsForViewMode(
  data: AppointmentWithRelations[] | null | undefined,
  viewMode: CalendarViewMode,
  timezone: string,
) {
  if (viewMode === "week") {
    return buildWeekScheduleEvents(data, timezone);
  }

  return {
    events: buildIndividualScheduleEvents(data, timezone),
    groupAppointmentsById: new Map<string, AppointmentWithRelations[]>(),
  };
}

function getInitialCalendarConfig(timezone: string) {
  const { weekAnchor, employeeId, viewMode } = useCalendarStore.getState();
  const { start: rangeStart, end: rangeEnd } = getRangeForViewMode(
    viewMode,
    weekAnchor,
  );
  const { startIso, endIso } = getClinicRangeIso(
    rangeStart,
    rangeEnd,
    timezone,
  );
  const key = appointmentsKey(startIso, endIso, employeeId);
  const entry = useAppointmentsStore.getState().byRange[key];

  const scheduleResult = buildScheduleEventsForViewMode(
    entry?.data,
    viewMode,
    timezone,
  );

  return {
    selectedDate: toPlainDate(weekAnchor),
    events: scheduleResult.events,
    weekAnchor: toPlainDate(weekAnchor).toString(),
    viewMode,
  };
}

export function useScheduleXCalendar(
  availableGridHeight: number,
  clinic: ClinicInfo | null,
) {
  const weekAnchor = useCalendarStore((state) => state.weekAnchor);
  const viewMode = useCalendarStore((state) => state.viewMode);
  const employeeId = useCalendarStore((state) => state.employeeId);
  const openCreateDialog = useCalendarStore((state) => state.openCreateDialog);
  const openEditDialog = useCalendarStore((state) => state.openEditDialog);
  const setVisibleRange = useCalendarStore((state) => state.setVisibleRange);
  const activeClinicTimezone = useActiveClinicTimezone();
  const timezone = clinic?.timezone ?? activeClinicTimezone;
  const hourRange = useMemo(
    () =>
      getClinicCalendarHourRange(clinic?.opening_time, clinic?.closing_time),
    [clinic?.closing_time, clinic?.opening_time],
  );
  const gridHeight = Math.max(
    availableGridHeight,
    getMinWeekGridHeight(hourRange),
  );

  const { start: rangeStart, end: rangeEnd } = getRangeForViewMode(
    viewMode,
    weekAnchor,
  );

  const rangeStartIso = rangeStart.toISOString();
  const rangeEndIso = rangeEnd.toISOString();

  const backgroundEvents = useMemo(
    () =>
      clinic
        ? buildClinicBackgroundEvents(clinic, hourRange, rangeStart, rangeEnd)
        : [],
    // rangeStartIso/rangeEndIso are stable string deps for Date objects
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      clinic,
      hourRange.endHour,
      hourRange.startHour,
      rangeStartIso,
      rangeEndIso,
    ],
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
    timeGridEvent: CalendarTimeGridEvent,
    weekGridDate: CalendarWeekGridDate,
  }))[0];
  const [initialConfig] = useState(() => getInitialCalendarConfig(timezone));

  const scheduleResult = useMemo(
    () => buildScheduleEventsForViewMode(appointments.data, viewMode, timezone),
    [appointments.data, timezone, viewMode],
  );

  const scheduleEvents = scheduleResult.events;

  const appointmentsById = useMemo(() => {
    const byId = new Map<string, AppointmentWithRelations>();
    for (const appointment of appointments.data ?? []) {
      byId.set(appointment.id, appointment);
    }
    return byId;
  }, [appointments.data]);

  const dayStatsByKey = useMemo(() => {
    if (viewMode !== "week") {
      return new Map();
    }

    const dayKeys = getWeekDays(weekAnchor).map((day) =>
      format(day, "yyyy-MM-dd"),
    );

    return computeDayStatsForRange(appointments.data ?? [], clinic, dayKeys);
  }, [appointments.data, clinic, viewMode, weekAnchor]);

  const openCreateDialogRef = useRef(openCreateDialog);
  const openEditDialogRef = useRef(openEditDialog);
  const openGroupSheetRef = useRef(calendarWeekUiRefs.openGroupSheet);
  const setVisibleRangeRef = useRef(setVisibleRange);
  const clinicRef = useRef(clinic);
  const syncedWeekAnchorRef = useRef(initialConfig.weekAnchor);

  useEffect(() => {
    openCreateDialogRef.current = openCreateDialog;
    openEditDialogRef.current = openEditDialog;
    openGroupSheetRef.current = calendarWeekUiRefs.openGroupSheet;
    setVisibleRangeRef.current = setVisibleRange;
    clinicRef.current = clinic;
  });

  useEffect(() => {
    updateCalendarWeekUiRefs({
      groupAppointmentsById: scheduleResult.groupAppointmentsById,
      appointmentsById,
      dayStatsByKey,
    });
  }, [appointmentsById, dayStatsByKey, scheduleResult.groupAppointmentsById]);

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
    timezone,
    firstDayOfWeek: 1,
    isResponsive: false,
    weekOptions: {
      nDays: 7,
      gridHeight,
    },
    selectedDate: initialConfig.selectedDate,
    dayBoundaries: hourRange.dayBoundaries,
    events: initialConfig.events,
    calendars: {},
    backgroundEvents,
    plugins: [eventsService, calendarControls],
    skipAnimations: true,
    callbacks: {
      onEventClick: (event) => {
        const eventId = String(event.id);
        if (isOverlapGroupEventId(eventId)) {
          openGroupSheetRef.current(eventId);
          return;
        }
        openEditDialogRef.current(eventId);
      },
      onClickDateTime: (dateTime) => {
        const c = clinicRef.current;
        if (c && isBlockedSlot(dateTime, c)) return;
        openCreateDialogRef.current(
          roundToNearestSlot(zonedDateTimeToWallDate(dateTime)),
        );
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

    calendarControls.setDayBoundaries(hourRange.dayBoundaries);
    calendarControls.setWeekOptions({ gridHeight });
  }, [calendarApp, calendarControls, gridHeight, hourRange.dayBoundaries]);

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
    gridHeight,
    isLoading: appointments.isLoading,
  };
}
