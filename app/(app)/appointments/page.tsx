import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import AppointmentsPageClient from "@/components/appointments/appointments-page-client";
import { getAppointmentsPage } from "@/dal/appointments.server.dal";
import { APPOINTMENTS_PAGE_SIZE } from "@/lib/appointment-pagination";
import { employeesServerQuery } from "@/lib/query/employees-server-query";
import { getQueryClient } from "@/lib/query/query-client";
import { getAppBootstrap } from "@/lib/server/bootstrap";
import {
  getClinicIsoDateRange,
  getClinicIsoWeekDateParams,
} from "@/lib/server/clinic-timezone";
import type { AppointmentStatus } from "@/types/database.types";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    employeeId?: string;
    from?: string;
    page?: string;
    q?: string;
    status?: string;
    to?: string;
  }>;
}) {
  const [params, bootstrap] = await Promise.all([
    searchParams,
    getAppBootstrap(),
  ]);
  const clinicId = bootstrap.activeClinicId;
  const timezone = bootstrap.activeClinicTimezone;

  const defaultDateParams = getClinicIsoWeekDateParams(timezone);
  const requestedFrom = params.from?.trim() ?? "";
  const requestedTo = params.to?.trim() ?? "";
  const fromParam = /^\d{4}-\d{2}-\d{2}$/.test(requestedFrom)
    ? requestedFrom
    : defaultDateParams.from;
  const toParam = /^\d{4}-\d{2}-\d{2}$/.test(requestedTo)
    ? requestedTo
    : defaultDateParams.to;
  const { from: startIso, to: endIso } = getClinicIsoDateRange(
    timezone,
    fromParam,
    toParam,
  );
  const employeeId = params.employeeId?.trim() || null;
  // Se siembra la consulta tal y como viene en la URL. Si no coincide con la
  // que el cliente calcula, `useServerSeed` la descarta y refetchea; sembrar
  // una página distinta de la que se va a mostrar sería peor que no sembrar.
  const query = {
    startIso,
    endIso,
    employeeId,
    status: (params.status?.trim() || null) as AppointmentStatus | null,
    search: params.q?.trim() ?? "",
    page: Math.max(0, Number.parseInt(params.page ?? "", 10) || 0),
    pageSize: APPOINTMENTS_PAGE_SIZE,
  };

  const queryClient = getQueryClient();
  const employeesPromise =
    bootstrap.user && clinicId
      ? queryClient.fetchQuery(
          employeesServerQuery({ userId: bootstrap.user.id, clinicId }),
        )
      : Promise.resolve(null);
  const [page] = await Promise.all([
    getAppointmentsPage({ ...query, clinicId }),
    employeesPromise,
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AppointmentsPageClient
        initialAppointments={page.appointments}
        initialTotal={page.total}
        initialQuery={query}
        initialRange={{
          from: fromParam,
          to: toParam,
          employeeId: employeeId ?? "",
        }}
      />
    </HydrationBoundary>
  );
}
