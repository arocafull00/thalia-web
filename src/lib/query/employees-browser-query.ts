import { queryOptions } from "@tanstack/react-query";

import {
  getEmployee,
  getEmployeeAppointments,
  getEmployeeAppointmentStats,
  getEmployees,
  getEmployeesPage,
  getPendingEmployeeInvitations,
} from "@/dal/employees.dal";
import {
  EMPLOYEE_ACTIVITY_STALE_TIME,
  EMPLOYEE_DIRECTORY_STALE_TIME,
  employeeKeys,
  normalizeEmployeesPageQuery,
  requireEmployeeId,
  requireEmployeeQueryScope,
  type EmployeeQueryScope,
  type EmployeesPageQuery,
} from "@/lib/query/employees-query";

export function employeesQuery(scope: EmployeeQueryScope) {
  return queryOptions({
    queryKey: employeeKeys.list(scope),
    queryFn: () => getEmployees(requireEmployeeQueryScope(scope).clinicId),
    staleTime: EMPLOYEE_DIRECTORY_STALE_TIME,
  });
}

export function employeesPageQuery(
  scope: EmployeeQueryScope,
  query: EmployeesPageQuery,
) {
  const normalizedQuery = normalizeEmployeesPageQuery(query);

  return queryOptions({
    queryKey: employeeKeys.page(scope, normalizedQuery),
    queryFn: () =>
      getEmployeesPage({
        ...normalizedQuery,
        clinicId: requireEmployeeQueryScope(scope).clinicId,
      }),
    staleTime: EMPLOYEE_DIRECTORY_STALE_TIME,
  });
}

export function employeeQuery(scope: EmployeeQueryScope, employeeId: string) {
  return queryOptions({
    queryKey: employeeKeys.detail(scope, employeeId),
    queryFn: () =>
      getEmployee(
        requireEmployeeId(employeeId),
        requireEmployeeQueryScope(scope).clinicId,
      ),
    staleTime: EMPLOYEE_DIRECTORY_STALE_TIME,
  });
}

export function employeeStatsQuery(
  scope: EmployeeQueryScope,
  employeeId: string,
) {
  return queryOptions({
    queryKey: employeeKeys.stats(scope, employeeId),
    queryFn: () =>
      getEmployeeAppointmentStats(
        requireEmployeeId(employeeId),
        requireEmployeeQueryScope(scope).clinicId,
      ),
    staleTime: EMPLOYEE_ACTIVITY_STALE_TIME,
  });
}

export function employeeAppointmentsQuery(
  scope: EmployeeQueryScope,
  employeeId: string,
) {
  return queryOptions({
    queryKey: employeeKeys.appointments(scope, employeeId),
    queryFn: () =>
      getEmployeeAppointments(
        requireEmployeeId(employeeId),
        requireEmployeeQueryScope(scope).clinicId,
      ),
    staleTime: EMPLOYEE_ACTIVITY_STALE_TIME,
  });
}

export function employeeInvitationsQuery(scope: EmployeeQueryScope) {
  return queryOptions({
    queryKey: employeeKeys.invitations(scope),
    queryFn: () =>
      getPendingEmployeeInvitations(requireEmployeeQueryScope(scope).clinicId),
    staleTime: EMPLOYEE_ACTIVITY_STALE_TIME,
  });
}
