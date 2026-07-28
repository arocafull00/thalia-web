import type { CalendarType } from "@schedule-x/calendar";

import type { Employee } from "@/types/database.types";

const DEFAULT_EMPLOYEE_HEX = "#6366f1";

const LIGHT_EVENT_SURFACE = "#FFFFFF";
const LIGHT_EVENT_INK = "#1F2933";
const DARK_EVENT_SURFACE = "#2A3238";
const DARK_EVENT_INK = "#F7F9FA";

type ColorDefinition = {
  main: string;
  container: string;
  onContainer: string;
};

type EmployeeCalendarSource = Pick<Employee, "id" | "full_name" | "color">;

function sanitizeColorName(employeeId: string): string {
  return employeeId.replace(/-/g, "").toLowerCase();
}

function stripeOnlyColors(hex: string): {
  lightColors: ColorDefinition;
  darkColors: ColorDefinition;
} {
  return {
    lightColors: {
      main: hex,
      container: LIGHT_EVENT_SURFACE,
      onContainer: LIGHT_EVENT_INK,
    },
    darkColors: {
      main: hex,
      container: DARK_EVENT_SURFACE,
      onContainer: DARK_EVENT_INK,
    },
  };
}

function toCalendarEntry(employee: EmployeeCalendarSource): CalendarType {
  const hex = employee.color ?? DEFAULT_EMPLOYEE_HEX;
  const { lightColors, darkColors } = stripeOnlyColors(hex);

  return {
    label: employee.full_name,
    colorName: sanitizeColorName(employee.id),
    lightColors,
    darkColors,
  };
}

export function buildEmployeeCalendars(
  employees: EmployeeCalendarSource[],
): Record<string, CalendarType> {
  const calendars: Record<string, CalendarType> = {};

  for (const employee of employees) {
    calendars[employee.id] = toCalendarEntry(employee);
  }

  return calendars;
}
