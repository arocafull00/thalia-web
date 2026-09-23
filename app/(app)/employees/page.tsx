import EmployeesPageClient from "@/components/employees/employees-page-client";
import { requireClinicManager } from "@/lib/server/business-access";

export default async function EmployeesPage() {
  await requireClinicManager();
  return <EmployeesPageClient />;
}
