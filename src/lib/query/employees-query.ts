import type { QueryClient } from "@tanstack/react-query";

import type { EmployeePageParams } from "@/dal/employees.dal";
import type { Employee } from "@/types/database.types";

export const EMPLOYEE_DIRECTORY_STALE_TIME = 5 * 60 * 1000;
export const EMPLOYEE_ACTIVITY_STALE_TIME = 30 * 1000;

export type EmployeeQueryScope = {
  userId: string;
  clinicId: string;
};

export type EmployeesPageQuery = Omit<EmployeePageParams, "clinicId">;

export function requireEmployeeQueryScope(scope: EmployeeQueryScope) {
  if (!scope.userId) {
    throw new Error("No hay sesión activa");
  }

  if (!scope.clinicId) {
    throw new Error("No hay clínica activa");
  }

  return scope;
}

export function requireEmployeeId(employeeId: string) {
  if (!employeeId) {
    throw new Error("No hay empleado seleccionado");
  }

  return employeeId;
}

export function normalizeEmployeesPageQuery(query: EmployeesPageQuery) {
  return {
    search: query.search.trim().toLowerCase(),
    role: query.role.trim().toLowerCase(),
    active: query.active,
    page: query.page,
    pageSize: query.pageSize,
  };
}

const scopeKey = (scope: EmployeeQueryScope) =>
  ["user", scope.userId, "clinic", scope.clinicId] as const;

export const employeeKeys = {
  root: (scope: EmployeeQueryScope) =>
    [...scopeKey(scope), "employees"] as const,
  list: (scope: EmployeeQueryScope) =>
    [...employeeKeys.root(scope), "list"] as const,
  pages: (scope: EmployeeQueryScope) =>
    [...employeeKeys.root(scope), "page"] as const,
  page: (scope: EmployeeQueryScope, query: EmployeesPageQuery) =>
    [...employeeKeys.pages(scope), normalizeEmployeesPageQuery(query)] as const,
  details: (scope: EmployeeQueryScope) =>
    [...employeeKeys.root(scope), "detail"] as const,
  detail: (scope: EmployeeQueryScope, employeeId: string) =>
    [...employeeKeys.details(scope), employeeId] as const,
  stats: (scope: EmployeeQueryScope, employeeId: string) =>
    [...employeeKeys.root(scope), "stats", employeeId] as const,
  appointments: (scope: EmployeeQueryScope, employeeId: string) =>
    [...employeeKeys.root(scope), "appointments", employeeId] as const,
  invitations: (scope: EmployeeQueryScope) =>
    [...employeeKeys.root(scope), "invitations"] as const,
};

export function setEmployeeQueryData(
  queryClient: QueryClient,
  scope: EmployeeQueryScope,
  employee: Employee,
) {
  queryClient.setQueryData(employeeKeys.detail(scope, employee.id), employee);
}

export async function invalidateEmployeeDirectory(
  queryClient: QueryClient,
  scope: EmployeeQueryScope,
) {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: employeeKeys.list(scope) }),
    queryClient.invalidateQueries({ queryKey: employeeKeys.pages(scope) }),
  ]);
}
