import type { DayStats } from "@/lib/calendar-day-stats";
import type { AppointmentWithRelations } from "@/types/database.types";

export type CalendarWeekUiRefs = {
  groupAppointmentsById: Map<string, AppointmentWithRelations[]>;
  appointmentsById: Map<string, AppointmentWithRelations>;
  dayStatsByKey: Map<string, DayStats>;
  openGroupSheet: (groupId: string) => void;
  navigateToDay: (date: Date) => void;
};

export const calendarWeekUiRefs: CalendarWeekUiRefs = {
  groupAppointmentsById: new Map(),
  appointmentsById: new Map(),
  dayStatsByKey: new Map(),
  openGroupSheet: () => {},
  navigateToDay: () => {},
};

export function updateCalendarWeekUiRefs(partial: Partial<CalendarWeekUiRefs>) {
  if (partial.groupAppointmentsById) {
    calendarWeekUiRefs.groupAppointmentsById = partial.groupAppointmentsById;
  }
  if (partial.appointmentsById) {
    calendarWeekUiRefs.appointmentsById = partial.appointmentsById;
  }
  if (partial.dayStatsByKey) {
    calendarWeekUiRefs.dayStatsByKey = partial.dayStatsByKey;
  }
  if (partial.openGroupSheet) {
    calendarWeekUiRefs.openGroupSheet = partial.openGroupSheet;
  }
  if (partial.navigateToDay) {
    calendarWeekUiRefs.navigateToDay = partial.navigateToDay;
  }
}
