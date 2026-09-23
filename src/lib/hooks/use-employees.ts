import { useMutation } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  cancelEmployeeInvitation,
  inviteEmployee,
  replaceEmployeeInvitation,
  setExternalMembershipStatus,
  updateEmployee,
  type EmployeeAppointmentRow,
  type EmployeeAppointmentStats,
  type EmployeePageResult,
} from "@/dal/employees.dal";
import { EMPLOYEES_PAGE_SIZE } from "@/lib/employee-pagination";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useRevalidateOnEntry } from "@/lib/hooks/use-revalidate-on-entry";
import {
  employeeKeys,
  requireEmployeeQueryScope,
  type EmployeesPageQuery,
} from "@/lib/query/employees-query";
import { employeeInviteSchema, employeeUpdateSchema } from "@/lib/schemas/employee-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import {
  employeeAppointmentsKey,
  employeeDetailKey,
  employeeInvitationsKey,
  employeeStatsKey,
  employeesListKey,
  employeesPageKey,
  useEmployeesStore,
} from "@/stores/employees-store";
import type { QueryEntry } from "@/stores/query-state";
import type {
  ClinicMembershipInvitationRole,
  Employee,
  PendingEmployeeInvitation,
} from "@/types/database.types";

export type CreateEmployeeInput = {
  email: string;
  role: ClinicMembershipInvitationRole;
};

export type { EmployeeAppointmentRow, EmployeeAppointmentStats };

type EmployeesPageFilters = {
  active: boolean | null;
  page: number;
  role: string;
  search: string;
};

type UpdateEmployeeInput = { id: string; values: Partial<Employee> };
type ReplaceEmployeeInvitationInput = {
  invitationId: string;
  values: CreateEmployeeInput;
};
type SetExternalMembershipStatusInput = {
  employeeId: string;
  status: "active" | "suspended";
};

function useEmployeeQueryScope() {
  const { user } = useAuth();
  const clinicId = useClinicId();
  const userId = user?.id ?? "";
  return useMemo(
    () => ({
      scope: { userId, clinicId: clinicId ?? "" },
      enabled: Boolean(userId && clinicId),
    }),
    [clinicId, userId],
  );
}

function useEmployeeEntry<T>(key: string, enabled: boolean, fetch: () => Promise<void>) {
  const entry = useEmployeesStore((state) => state.queries[key]) as QueryEntry<T> | undefined;
  useRevalidateOnEntry(enabled ? `employee:${key}` : null, fetch);
  const data = entry?.data ?? null;
  return {
    data,
    error: entry?.error ?? null,
    isLoading: enabled && data == null,
    isPending: data == null,
    isFetching: entry?.loading ?? false,
    refresh: fetch,
    refetch: fetch,
  };
}

export function useEmployeesPage(filters: EmployeesPageFilters) {
  const { enabled } = useEmployeeQueryScope();
  const query = useMemo<EmployeesPageQuery>(
    () => ({
      search: filters.search,
      role: filters.role,
      active: filters.active,
      page: filters.page,
      pageSize: EMPLOYEES_PAGE_SIZE,
    }),
    [filters.active, filters.page, filters.role, filters.search],
  );
  const key = employeesPageKey(query);
  const fetch = useEmployeesStore((state) => state.fetchEmployeesPage);
  const result = useEmployeeEntry<EmployeePageResult>(key, enabled, () => fetch(query));
  return {
    ...result,
    employees: result.data?.employees ?? [],
    total: result.data?.total ?? 0,
  };
}

export function useEmployees() {
  const { enabled } = useEmployeeQueryScope();
  const fetch = useEmployeesStore((state) => state.fetchEmployees);
  return useEmployeeEntry<Employee[]>(employeesListKey, enabled, fetch);
}

export function useEmployee(employeeId: string) {
  const { enabled } = useEmployeeQueryScope();
  const fetch = useEmployeesStore((state) => state.fetchEmployee);
  return useEmployeeEntry<Employee>(
    employeeDetailKey(employeeId), enabled && Boolean(employeeId), () => fetch(employeeId),
  );
}

export function useEmployeeAppointmentStats(employeeId: string) {
  const { enabled } = useEmployeeQueryScope();
  const fetch = useEmployeesStore((state) => state.fetchStats);
  return useEmployeeEntry<EmployeeAppointmentStats>(
    employeeStatsKey(employeeId), enabled && Boolean(employeeId), () => fetch(employeeId),
  );
}

export function useEmployeeAppointments(employeeId: string) {
  const { enabled } = useEmployeeQueryScope();
  const fetch = useEmployeesStore((state) => state.fetchAppointments);
  return useEmployeeEntry<EmployeeAppointmentRow[]>(
    employeeAppointmentsKey(employeeId), enabled && Boolean(employeeId), () => fetch(employeeId),
  );
}

export function usePendingEmployeeInvitations() {
  const { enabled } = useEmployeeQueryScope();
  const fetch = useEmployeesStore((state) => state.fetchInvitations);
  return useEmployeeEntry<PendingEmployeeInvitation[]>(employeeInvitationsKey, enabled, fetch);
}

export function useCreateEmployee() {
  const updateInvitations = useEmployeesStore((state) => state.updateInvitations);
  const fetchInvitations = useEmployeesStore((state) => state.fetchInvitations);
  const { scope } = useEmployeeQueryScope();

  return useMutation({
    mutationKey: [...employeeKeys.root(scope), "invite"],
    mutationFn: async (input: CreateEmployeeInput) => {
      const parsed = employeeInviteSchema.safeParse(input);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      return inviteEmployee({
        ...parsed.data,
        clinicId: requireEmployeeQueryScope(scope).clinicId,
      });
    },
    onSuccess: async (invitation) => {
      updateInvitations((current) => [invitation, ...current]);
      await fetchInvitations();
    },
  });
}

export function useReplaceEmployeeInvitation() {
  const updateInvitations = useEmployeesStore((state) => state.updateInvitations);
  const fetchInvitations = useEmployeesStore((state) => state.fetchInvitations);
  const { scope } = useEmployeeQueryScope();

  return useMutation({
    mutationKey: [...employeeKeys.root(scope), "replace-invitation"],
    mutationFn: async ({
      invitationId,
      values,
    }: ReplaceEmployeeInvitationInput) => {
      const parsed = employeeInviteSchema.safeParse(values);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      return replaceEmployeeInvitation({
        ...parsed.data,
        clinicId: requireEmployeeQueryScope(scope).clinicId,
        invitationId,
      });
    },
    onSuccess: async (invitation, { invitationId }) => {
      updateInvitations((current) =>
        current.map((entry) => entry.id === invitationId ? invitation : entry),
      );
      await fetchInvitations();
    },
  });
}

export function useCancelEmployeeInvitation() {
  const updateInvitations = useEmployeesStore((state) => state.updateInvitations);
  const fetchInvitations = useEmployeesStore((state) => state.fetchInvitations);
  const { scope } = useEmployeeQueryScope();

  return useMutation({
    mutationKey: [...employeeKeys.root(scope), "cancel-invitation"],
    mutationFn: async (invitationId: string) => {
      await cancelEmployeeInvitation({
        clinicId: requireEmployeeQueryScope(scope).clinicId,
        invitationId,
      });
      return invitationId;
    },
    onSuccess: async (invitationId) => {
      updateInvitations((current) => current.filter((entry) => entry.id !== invitationId));
      await fetchInvitations();
    },
  });
}

export function useUpdateEmployee() {
  const updateEmployeeData = useEmployeesStore((state) => state.updateEmployeeData);
  const refreshDirectory = useEmployeesStore((state) => state.refreshDirectory);
  const { scope } = useEmployeeQueryScope();

  return useMutation({
    mutationKey: [...employeeKeys.root(scope), "update"],
    mutationFn: async ({ id, values }: UpdateEmployeeInput) => {
      const parsed = employeeUpdateSchema.safeParse(values);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      return updateEmployee(id, parsed.data);
    },
    onSuccess: async (employee) => {
      updateEmployeeData(employee);
      await refreshDirectory();
    },
  });
}

export function useSetExternalMembershipStatus() {
  const updateExternalStatus = useEmployeesStore((state) => state.updateExternalStatus);
  const refreshDirectory = useEmployeesStore((state) => state.refreshDirectory);
  const { scope } = useEmployeeQueryScope();

  return useMutation({
    mutationKey: [...employeeKeys.root(scope), "external-status"],
    mutationFn: ({ employeeId, status }: SetExternalMembershipStatusInput) =>
      setExternalMembershipStatus(
        employeeId,
        requireEmployeeQueryScope(scope).clinicId,
        status,
      ),
    onSuccess: async (_data, { employeeId, status }) => {
      updateExternalStatus(employeeId, status === "active");
      await refreshDirectory();
    },
  });
}
