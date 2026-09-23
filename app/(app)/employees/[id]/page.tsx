import EmployeeDetailPageClient from "@/components/employees/employee-detail-page-client";
import { requireClinicManager } from "@/lib/server/business-access";

export default async function EmployeeDetailPage() {
  await requireClinicManager();
  return <EmployeeDetailPageClient />;
}
