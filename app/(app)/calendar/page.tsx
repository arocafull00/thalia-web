import CalendarPageClient from "@/components/calendar/calendar-page-client";
import { getClinicById } from "@/dal/clinics.server.dal";
import { getEmployees } from "@/dal/employees.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function CalendarPage() {
  const clinicId = await getServerActiveClinicId();

  if (!clinicId) {
    return <CalendarPageClient />;
  }

  const [clinic, employees] = await Promise.all([
    getClinicById(clinicId),
    getEmployees(clinicId),
  ]);

  return (
    <CalendarPageClient initialClinic={clinic} initialEmployees={employees} />
  );
}
