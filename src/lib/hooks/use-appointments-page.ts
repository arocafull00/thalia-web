import { endOfDay, startOfDay } from "date-fns";
import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { useCallback, useEffect, useMemo } from "react";

import {
  formatAppointmentDateParam,
  getDefaultAppointmentDateRange,
  parseAppointmentDateParam,
} from "@/components/appointments/components/appointment-date-range";
import {
  formatClinicDayKey,
  getClinicRangeIso,
} from "@/lib/appointment-datetime";
import { APPOINTMENTS_PAGE_SIZE } from "@/lib/appointment-pagination";
import { useActiveClinicTimezone } from "@/lib/hooks/use-active-clinic";
import { useServerSeed } from "@/lib/hooks/use-server-seed";
import {
  appointmentsPageKey,
  useAppointmentsStore,
  type AppointmentsPageQuery,
} from "@/stores/appointments-store";
import { isInitialLoading, isQueryFresh } from "@/stores/query-state";
import type {
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

type AppointmentPageFilters = {
  employeeId: string;
  from: string;
  page: number;
  search: string;
  status: string;
  to: string;
};

type AppointmentsPageSeed = {
  initialAppointments?: AppointmentWithRelations[];
  initialTotal?: number;
  initialQuery?: AppointmentsPageQuery;
  initialRange?: {
    employeeId: string;
    from: string;
    to: string;
  };
};

/**
 * Listado de citas paginado en servidor.
 *
 * Filtros, búsqueda y orden viajan al servidor: filtrar en cliente sobre una
 * página ya recortada daría recuentos falsos —pedirías 20 filas y mostrarías
 * 6— y la paginación dejaría de ser correcta.
 */
export function useAppointmentsPage(
  filters: AppointmentPageFilters,
  seed?: AppointmentsPageSeed,
) {
  const timezone = useActiveClinicTimezone();
  const defaults = (() => {
    if (seed?.initialRange?.from && seed.initialRange.to) {
      const fallback = getDefaultAppointmentDateRange(timezone);

      return {
        from: parseAppointmentDateParam(seed.initialRange.from, fallback.from),
        to: parseAppointmentDateParam(seed.initialRange.to, fallback.to),
      };
    }

    return getDefaultAppointmentDateRange(timezone);
  })();

  const rangeStart = useMemo(
    () => startOfDay(parseAppointmentDateParam(filters.from, defaults.from)),
    [defaults.from, filters.from],
  );

  const rangeEnd = useMemo(
    () => endOfDay(parseAppointmentDateParam(filters.to, defaults.to)),
    [defaults.to, filters.to],
  );

  const { startIso, endIso } = getClinicRangeIso(
    rangeStart,
    rangeEnd,
    timezone,
  );

  const query = useMemo<AppointmentsPageQuery>(
    () => ({
      startIso,
      endIso,
      employeeId: filters.employeeId || null,
      status: (filters.status || null) as AppointmentStatus | null,
      search: filters.search,
      page: filters.page,
      pageSize: APPOINTMENTS_PAGE_SIZE,
    }),
    [
      endIso,
      filters.employeeId,
      filters.page,
      filters.search,
      filters.status,
      startIso,
    ],
  );

  const key = appointmentsPageKey(query);
  const entry = useAppointmentsStore((state) => state.byPage[key]);
  const fetchAppointmentsPage = useAppointmentsStore(
    (state) => state.fetchAppointmentsPage,
  );
  const seedAppointmentsPage = useAppointmentsStore(
    (state) => state.seedAppointmentsPage,
  );
  const subscribeRealtime = useAppointmentsStore(
    (state) => state.subscribeRealtime,
  );
  const unsubscribeRealtime = useAppointmentsStore(
    (state) => state.unsubscribeRealtime,
  );

  // La siembra del servidor sólo vale para la consulta exacta que resolvió: si
  // los filtros de la URL no coinciden, se descarta y el cliente vuelve a pedir.
  const seededResult = useServerSeed(
    key,
    seed?.initialQuery ? appointmentsPageKey(seed.initialQuery) : "",
    seed?.initialAppointments
      ? {
          appointments: seed.initialAppointments,
          total: seed.initialTotal ?? seed.initialAppointments.length,
        }
      : undefined,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    subscribeRealtime();
    return () => unsubscribeRealtime();
  }, [subscribeRealtime, unsubscribeRealtime]);

  useEffect(() => {
    if (seededResult === undefined || hasClientData) {
      return;
    }

    seedAppointmentsPage(query, seededResult);
  }, [hasClientData, query, seedAppointmentsPage, seededResult]);

  useRevalidateOnEntry(`appointments-page:${key}`, () => fetchAppointmentsPage(query));

  const resolved = isQueryFresh(entry)
    ? entry!.data
    : (seededResult ?? entry?.data ?? null);

  const refresh = useCallback(() => {
    if (useAppointmentsStore.getState().byPage[key]?.loading) {
      return Promise.resolve();
    }

    return fetchAppointmentsPage(query);
  }, [fetchAppointmentsPage, key, query]);

  const appointments = {
    data: resolved,
    error: entry?.error ?? null,
    isLoading: resolved == null && isInitialLoading(entry),
    // `loading` con datos ya en pantalla es un refresco, no una carga inicial.
    isRefreshing: entry?.loading ?? false,
    refresh,
  };

  const flatAppointments = useMemo(
    () => resolved?.appointments ?? [],
    [resolved],
  );

  const total = resolved?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / APPOINTMENTS_PAGE_SIZE));

  // La lista móvil agrupa por día. La página puede empezar a media jornada, así
  // que la cabecera del día se repite en la siguiente en lugar de perderse.
  const groupedAppointments = useMemo(() => {
    const byDay = new Map<string, AppointmentWithRelations[]>();

    for (const appointment of flatAppointments) {
      const day = formatClinicDayKey(appointment.starts_at, timezone);
      if (!byDay.has(day)) {
        byDay.set(day, []);
      }

      byDay.get(day)!.push(appointment);
    }

    return Array.from(byDay.entries()).map(([day, dayAppointments]) => ({
      appointments: dayAppointments,
      date: new Date(`${day}T00:00:00`),
    }));
  }, [flatAppointments, timezone]);

  const hasResults = flatAppointments.length > 0;
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
    listData,
    pageCount,
    rangeEnd,
    rangeStart,
    showEmptyState,
    total,
  };
}

export type { AppointmentPageFilters };
