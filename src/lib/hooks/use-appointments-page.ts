import { addDays, endOfDay, format, startOfToday } from "date-fns";
import { useMemo, useState } from "react";

import { useAppointments } from "@/lib/hooks/use-appointments";

export function useAppointmentsPage(externalSearch?: string) {
  const [localSearch, setSearch] = useState("");
  const search = externalSearch !== undefined ? externalSearch : localSearch;

  const { rangeEnd, rangeStart } = useMemo(() => {
    const today = startOfToday();
    return { rangeEnd: endOfDay(addDays(today, 13)), rangeStart: today };
  }, []);

  const appointments = useAppointments({ end: rangeEnd, start: rangeStart }, null);

  const groupedAppointments = useMemo(() => {
    const items = appointments.data ?? [];
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = normalizedSearch
      ? items.filter((appt) => {
          const patientName = appt.patients?.full_name?.toLowerCase() ?? "";
          const treatment =
            appt.appointment_treatments[0]?.treatment_types?.name?.toLowerCase() ?? "";
          return patientName.includes(normalizedSearch) || treatment.includes(normalizedSearch);
        })
      : items;

    const byDay = new Map<string, typeof filtered>();
    for (const appt of filtered) {
      const day = format(new Date(appt.starts_at), "yyyy-MM-dd");
      if (!byDay.has(day)) byDay.set(day, []);
      byDay.get(day)!.push(appt);
    }

    return Array.from(byDay.entries()).map(([day, dayAppointments]) => ({
      appointments: dayAppointments,
      date: new Date(`${day}T00:00:00`),
    }));
  }, [appointments.data, search]);

  const flatAppointments = useMemo(
    () => groupedAppointments.flatMap((group) => group.appointments),
    [groupedAppointments],
  );

  const hasResults = groupedAppointments.length > 0;
  const showEmptyState = !appointments.isLoading && !appointments.error && !hasResults;
  const listData = showEmptyState || appointments.isLoading ? [] : groupedAppointments;

  return {
    appointments,
    flatAppointments,
    groupedAppointments,
    hasResults,
    listData,
    search,
    setSearch,
    showEmptyState,
  };
}
