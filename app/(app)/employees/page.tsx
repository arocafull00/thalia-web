import EmployeesPageClient from "@/components/employees/employees-page-client";
import { getEmployees } from "@/dal/employees.server.dal";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

export default async function EmployeesPage() {
  const clinicId = await getServerActiveClinicId();
  const employees = await getEmployees(clinicId);

  return <EmployeesPageClient initialEmployees={employees} />;
}
