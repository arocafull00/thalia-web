import SettingsLayoutClient from "@/components/settings/settings-layout-client";
import { getClinicById } from "@/dal/clinics.server.dal";
import { getEmployees } from "@/dal/employees.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

type SettingsLayoutProps = {
  children: React.ReactNode;
};

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const clinicId = await getServerActiveClinicId();

  if (!clinicId) {
    return <SettingsLayoutClient>{children}</SettingsLayoutClient>;
  }

  const [clinic, employees] = await Promise.all([
    getClinicById(clinicId),
    getEmployees(clinicId),
  ]);

  return (
    <SettingsLayoutClient initialClinic={clinic} initialEmployees={employees}>
      {children}
    </SettingsLayoutClient>
  );
}
