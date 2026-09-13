import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { notFound } from "next/navigation";

import EmployeeDetailPageClient from "@/components/employees/employee-detail-page-client";
import { logger } from "@/lib/logger";
import {
  employeeAppointmentsServerQuery,
  employeeServerQuery,
  employeeStatsServerQuery,
} from "@/lib/query/employees-server-query";
import { getQueryClient } from "@/lib/query/query-client";
import { getAppBootstrap } from "@/lib/server/bootstrap";
import { requireClinicManager } from "@/lib/server/business-access";
import type { Employee } from "@/types/database.types";

export default async function EmployeeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireClinicManager();
  const [{ id }, bootstrap] = await Promise.all([params, getAppBootstrap()]);

  if (!bootstrap.user || !bootstrap.activeClinicId) {
    return <EmployeeDetailPageClient />;
  }

  const scope = {
    userId: bootstrap.user.id,
    clinicId: bootstrap.activeClinicId,
  };
  const queryClient = getQueryClient();
  let employee: Employee | null;

  try {
    [employee] = await Promise.all([
      queryClient.fetchQuery(employeeServerQuery(scope, id)),
      queryClient.fetchQuery(employeeStatsServerQuery(scope, id)),
      queryClient.fetchQuery(employeeAppointmentsServerQuery(scope, id)),
    ]);
  } catch (cause) {
    logger.captureException(cause, {
      action: "loadEmployeeDetail",
      employeeId: id,
    });
    return (
      <HydrationBoundary state={dehydrate(queryClient)}>
        <EmployeeDetailPageClient />
      </HydrationBoundary>
    );
  }

  if (!employee) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployeeDetailPageClient />
    </HydrationBoundary>
  );
}
