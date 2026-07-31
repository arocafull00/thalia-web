import { notFound } from "next/navigation";

import EmployeeDetailPageClient from "@/components/employees/employee-detail-page-client";
import {
  getEmployee,
  getEmployeeAppointments,
  getEmployeeAppointmentStats,
} from "@/dal/employees.server.dal";
import { logger } from "@/lib/logger";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let employee: Awaited<ReturnType<typeof getEmployee>>;
  let stats: Awaited<ReturnType<typeof getEmployeeAppointmentStats>>;
  let appointments: Awaited<ReturnType<typeof getEmployeeAppointments>>;

  try {
    [employee, stats, appointments] = await Promise.all([
      getEmployee(id),
      getEmployeeAppointmentStats(id),
      getEmployeeAppointments(id),
    ]);
  } catch (cause) {
    logger.captureException(cause, {
      action: "loadEmployeeDetail",
      employeeId: id,
    });
    return <EmployeeDetailPageClient />;
  }

  if (!employee) {
    notFound();
  }

  return (
    <EmployeeDetailPageClient
      employee={employee}
      initialStats={stats}
      initialAppointments={appointments}
    />
  );
}
