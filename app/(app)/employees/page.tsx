import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import EmployeesPageClient from "@/components/employees/employees-page-client";
import {
  EMPLOYEES_PAGE_SIZE,
  parseEmployeeStatusFilter,
} from "@/lib/employee-pagination";
import { employeesPageServerQuery } from "@/lib/query/employees-server-query";
import { getQueryClient } from "@/lib/query/query-client";
import { getAppBootstrap } from "@/lib/server/bootstrap";
import { requireClinicManager } from "@/lib/server/business-access";

export default async function EmployeesPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    q?: string;
    role?: string;
    status?: string;
  }>;
}) {
  await requireClinicManager();
  const [params, bootstrap] = await Promise.all([
    searchParams,
    getAppBootstrap(),
  ]);

  const query = {
    search: params.q?.trim() ?? "",
    role: params.role?.trim() ?? "",
    active: parseEmployeeStatusFilter(params.status ?? ""),
    page: Math.max(0, Number.parseInt(params.page ?? "", 10) || 0),
    pageSize: EMPLOYEES_PAGE_SIZE,
  };

  if (!bootstrap.user || !bootstrap.activeClinicId) {
    return <EmployeesPageClient />;
  }

  const scope = {
    userId: bootstrap.user.id,
    clinicId: bootstrap.activeClinicId,
  };
  const queryClient = getQueryClient();
  await queryClient.fetchQuery(employeesPageServerQuery(scope, query));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EmployeesPageClient />
    </HydrationBoundary>
  );
}
