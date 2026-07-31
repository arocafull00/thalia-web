import { endOfDay, format, startOfDay } from "date-fns";
import { useMemo } from "react";

import {
  formatAppointmentDateParam,
  getDefaultAppointmentDateRange,
  parseAppointmentDateParam,
} from "@/components/appointments/components/appointment-date-range";
import { useAppointments } from "@/lib/hooks/use-appointments";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import { appointmentsKey } from "@/stores/appointments-store";
import type {
  AppointmentWithRelations,
  Employee,
} from "@/types/database.types";

type AppointmentPageFilters = {
  employeeId: string;
  from: string;
  search: string;
  status: string;
  to: string;
};

type AppointmentsPageSeed = {
  initialAppointments?: AppointmentWithRelations[];
  initialAppointmentsKey?: string;
  initialEmployees?: Employee[];
  initialRange?: {
    employeeId: string;
    from: string;
    to: string;
  };
};

export function useAppointmentsPage(
  filters: AppointmentPageFilters,
  seed?: AppointmentsPageSeed,
) {
  const defaults = (() => {
    if (seed?.initialRange?.from && seed.initialRange.to) {
      const fallback = getDefaultAppointmentDateRange();

      return {
        from: parseAppointmentDateParam(seed.initialRange.from, fallback.from),
        to: parseAppointmentDateParam(seed.initialRange.to, fallback.to),
      };
    }

    return getDefaultAppointmentDateRange();
  })();

  const rangeStart = useMemo(
    () => startOfDay(parseAppointmentDateParam(filters.from, defaults.from)),
    [defaults.from, filters.from],
  );

  const rangeEnd = useMemo(
    () => endOfDay(parseAppointmentDateParam(filters.to, defaults.to)),
    [defaults.to, filters.to],
  );

  const employeeId = filters.employeeId || null;
  const appointmentsKeyValue = appointmentsKey(
    rangeStart.toISOString(),
    rangeEnd.toISOString(),
    employeeId,
  );
  const seededAppointments = useServerSeed(
    appointmentsKeyValue,
    seed?.initialAppointmentsKey ?? "",
    seed?.initialAppointments,
  );
  const appointments = useAppointments(
    { end: rangeEnd, start: rangeStart },
    employeeId,
    seededAppointments,
  );

  const groupedAppointments = useMemo(() => {
    const items = appointments.data ?? [];
    const normalizedSearch = filters.search.trim().toLowerCase();

    const filtered = items.filter((appt) => {
      if (filters.status && appt.status !== filters.status) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const patientName = appt.patients?.full_name?.toLowerCase() ?? "";
      const patientPhone = appt.patients?.phone?.toLowerCase() ?? "";
      const treatment =
        appt.appointment_treatments[0]?.treatment?.name?.toLowerCase() ?? "";

      return (
        patientName.includes(normalizedSearch) ||
        patientPhone.includes(normalizedSearch) ||
        treatment.includes(normalizedSearch)
      );
    });

    const byDay = new Map<string, typeof filtered>();
    for (const appt of filtered) {
      const day = format(new Date(appt.starts_at), "yyyy-MM-dd");
      if (!byDay.has(day)) {
        byDay.set(day, []);
      }

      byDay.get(day)!.push(appt);
    }

    return Array.from(byDay.entries()).map(([day, dayAppointments]) => ({
      appointments: dayAppointments,
      date: new Date(`${day}T00:00:00`),
    }));
  }, [appointments.data, filters.search, filters.status]);

  const flatAppointments = useMemo(
    () => groupedAppointments.flatMap((group) => group.appointments),
    [groupedAppointments],
  );

  const hasResults = groupedAppointments.length > 0;
  const showEmptyState =
    !appointments.isLoading && !appointments.error && !hasResults;
  const listData =
    showEmptyState || appointments.isLoading ? [] : groupedAppointments;

  const dateRangeLabel = `${formatAppointmentDateParam(rangeStart)} – ${formatAppointmentDateParam(rangeEnd)}`;

  return {
    appointments,
    dateRangeLabel,
    flatAppointments,
    groupedAppointments,
    hasResults,
    initialEmployees: seed?.initialEmployees,
    listData,
    rangeEnd,
    rangeStart,
    showEmptyState,
  };
}

export type { AppointmentPageFilters };
