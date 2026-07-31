import SettingsPageClient from "@/components/settings/settings-page-client";
import { getClinicById } from "@/dal/clinics.server.dal";
import { getEmployees } from "@/dal/employees.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function SettingsPage() {
  const clinicId = await getServerActiveClinicId();

  if (!clinicId) {
    return <SettingsPageClient />;
  }

  const [clinic, employees] = await Promise.all([
    getClinicById(clinicId),
    getEmployees(clinicId),
  ]);

  return (
    <SettingsPageClient initialClinic={clinic} initialEmployees={employees} />
  );
}
