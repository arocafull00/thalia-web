import { useMemo } from "react";

import { toAgendaAppointments } from "@/lib/calendar-agenda";
import { buildDashboardDay } from "@/lib/dashboard-day";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import { useClinicServerSeed } from "@/lib/hooks/use-server-seed";
import type { DashboardData } from "@/stores/dashboard-store";
import { useDashboardStore } from "@/stores/dashboard-store";
import { isInitialLoading, isQueryFresh } from "@/stores/query-state";

export function useDashboard(initialData?: DashboardData) {
  const entry = useDashboardStore((state) => state.data);
  const fetchDashboard = useDashboardStore((state) => state.fetchDashboard);
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);

  useRevalidateOnEntry(clinicId ? `dashboard:${clinicId}` : null, () =>
    fetchDashboard(),
  );

  const data = isQueryFresh(entry) ? entry.data : (seededData ?? entry.data);

  const appointments = useMemo(
    () => toAgendaAppointments(data?.appointments),
    [data?.appointments],
  );

  /*
   * El reparto del día se deriva aquí y no en el componente: son valores
   * calculados, y `CLAUDE.md` los quiere en el hook.
   *
   * `new Date()` se captura en cada render a propósito. Solo decide cuál es la
   * siguiente cita, y mantenerlo en estado obligaría a refrescarlo con un
   * temporizador para que no se quedase viejo. Lo que está en curso no depende
   * del reloj: depende del estado `in_progress`.
   */
  const day = useMemo(
    () => buildDashboardDay(appointments, new Date()),
    [appointments],
  );

  return {
    day,
    isLoading: data == null && isInitialLoading(entry),
    error: entry.error,
    refresh: fetchDashboard,
  };
}
