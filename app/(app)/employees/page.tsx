import EmployeesPageClient from "@/components/employees/employees-page-client";
import { getEmployeesPage } from "@/dal/employees.server.dal";
import {
  EMPLOYEES_PAGE_SIZE,
  parseEmployeeStatusFilter,
} from "@/lib/employee-pagination";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";

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
  const [params, clinicId] = await Promise.all([
    searchParams,
    getServerActiveClinicId(),
  ]);

  // Se siembra la consulta tal y como viene en la URL. Si no coincide con la
  // que calcula el cliente, `useServerSeed` la descarta y refetchea; sembrar
  // una página distinta de la que se va a mostrar sería peor que no sembrar.
  const query = {
    search: params.q?.trim() ?? "",
    role: params.role?.trim() ?? "",
    active: parseEmployeeStatusFilter(params.status ?? ""),
    page: Math.max(0, Number.parseInt(params.page ?? "", 10) || 0),
    pageSize: EMPLOYEES_PAGE_SIZE,
  };

  const page = await getEmployeesPage({ ...query, clinicId });

  return <EmployeesPageClient initialPage={page} initialQuery={query} />;
}
