import DashboardPageClient from "@/components/dashboard/dashboard-page-client";
import { getAppointments } from "@/dal/appointments.server.dal";
import {
  getServerActiveClinicId,
  getServerActiveClinicTimezone,
} from "@/lib/server/active-clinic";
import { getClinicDayRange } from "@/lib/server/clinic-timezone";

export default async function DashboardPage() {
  const [clinicId, timezone] = await Promise.all([
    getServerActiveClinicId(),
    getServerActiveClinicTimezone(),
  ]);
  const { from, to } = getClinicDayRange(timezone);
  const appointments = await getAppointments({
    startIso: from,
    endIso: to,
    clinicId,
    employeeId: null,
  });

  return <DashboardPageClient initialData={{ appointments }} />;
}
