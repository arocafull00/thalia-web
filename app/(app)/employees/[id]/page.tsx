import EmployeeDetailPageClient from "@/components/employees/employee-detail-page-client";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EmployeeDetailPageClient employeeId={id} />;
}
