import AppointmentsPageClient from "@/components/appointments/appointments-page-client";
import { getAppointments } from "@/dal/appointments.server.dal";
import { getEmployees } from "@/dal/employees.server.dal";
import {
  getServerActiveClinicId,
  getServerActiveClinicTimezone,
} from "@/lib/server/active-clinic";
import {
  getClinicIsoDateRange,
  getClinicIsoWeekDateParams,
} from "@/lib/server/clinic-timezone";
import { appointmentsKey } from "@/stores/appointments-store";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{
    employeeId?: string;
    from?: string;
    to?: string;
  }>;
}) {
  const [params, clinicId, timezone] = await Promise.all([
    searchParams,
    getServerActiveClinicId(),
    getServerActiveClinicTimezone(),
  ]);

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

  const [appointments, employees] = await Promise.all([
    getAppointments({
      startIso,
      endIso,
      clinicId,
      employeeId,
    }),
    getEmployees(clinicId),
  ]);

  return (
    <AppointmentsPageClient
      initialAppointments={appointments}
      initialAppointmentsKey={appointmentsKey(startIso, endIso, employeeId)}
      initialEmployees={employees}
      initialRange={{
        from: fromParam,
        to: toParam,
        employeeId: employeeId ?? "",
      }}
    />
  );
}
