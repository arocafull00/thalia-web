import "server-only";

import { queryOptions } from "@tanstack/react-query";

import {
  getEmployeeAppointments,
  getEmployeeAppointmentStats,
  getClinicEmployee,
  getEmployees,
  getEmployeesPage,
} from "@/dal/employees.server.dal";
import {
  EMPLOYEE_ACTIVITY_STALE_TIME,
  EMPLOYEE_DIRECTORY_STALE_TIME,
  employeeKeys,
  normalizeEmployeesPageQuery,
  type EmployeeQueryScope,
  type EmployeesPageQuery,
} from "@/lib/query/employees-query";

export function employeesServerQuery(scope: EmployeeQueryScope) {
  return queryOptions({
    queryKey: employeeKeys.list(scope),
    queryFn: () => getEmployees(scope.clinicId),
    staleTime: EMPLOYEE_DIRECTORY_STALE_TIME,
  });
}

export function employeesPageServerQuery(
  scope: EmployeeQueryScope,
  query: EmployeesPageQuery,
) {
  const normalizedQuery = normalizeEmployeesPageQuery(query);

  return queryOptions({
    queryKey: employeeKeys.page(scope, normalizedQuery),
    queryFn: () =>
      getEmployeesPage({ ...normalizedQuery, clinicId: scope.clinicId }),
    staleTime: EMPLOYEE_DIRECTORY_STALE_TIME,
  });
}

export function employeeServerQuery(
  scope: EmployeeQueryScope,
  employeeId: string,
) {
  return queryOptions({
    queryKey: employeeKeys.detail(scope, employeeId),
    queryFn: () => getClinicEmployee(employeeId, scope.clinicId),
    staleTime: EMPLOYEE_DIRECTORY_STALE_TIME,
  });
}

export function employeeStatsServerQuery(
  scope: EmployeeQueryScope,
  employeeId: string,
) {
  return queryOptions({
    queryKey: employeeKeys.stats(scope, employeeId),
    queryFn: () => getEmployeeAppointmentStats(employeeId, scope.clinicId),
    staleTime: EMPLOYEE_ACTIVITY_STALE_TIME,
  });
}

export function employeeAppointmentsServerQuery(
  scope: EmployeeQueryScope,
  employeeId: string,
) {
  return queryOptions({
    queryKey: employeeKeys.appointments(scope, employeeId),
    queryFn: () => getEmployeeAppointments(employeeId, scope.clinicId),
    staleTime: EMPLOYEE_ACTIVITY_STALE_TIME,
  });
}
