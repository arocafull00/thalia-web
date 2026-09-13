import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";

import {
  cancelEmployeeInvitation,
  inviteEmployee,
  replaceEmployeeInvitation,
  setExternalMembershipStatus,
  updateEmployee,
  type EmployeeAppointmentRow,
  type EmployeeAppointmentStats,
} from "@/dal/employees.dal";
import { EMPLOYEES_PAGE_SIZE } from "@/lib/employee-pagination";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  employeeAppointmentsQuery,
  employeeInvitationsQuery,
  employeeQuery,
  employeesPageQuery,
  employeesQuery,
  employeeStatsQuery,
} from "@/lib/query/employees-browser-query";
import {
  employeeKeys,
  invalidateEmployeeDirectory,
  requireEmployeeQueryScope,
  setEmployeeQueryData,
  type EmployeesPageQuery,
} from "@/lib/query/employees-query";
import {
  employeeInviteSchema,
  employeeUpdateSchema,
} from "@/lib/schemas/employee-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
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

type UpdateEmployeeInput = {
  id: string;
  values: Partial<Employee>;
};

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

export function useEmployeesPage(filters: EmployeesPageFilters) {
  const { scope, enabled } = useEmployeeQueryScope();
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
  const result = useQuery({
    ...employeesPageQuery(scope, query),
    enabled,
  });
  const employees = useMemo(
    () => result.data?.employees ?? [],
    [result.data?.employees],
  );

  return {
    employees,
    total: result.data?.total ?? 0,
    error: result.error,
    isLoading: result.data == null && result.isPending,
    isPending: result.isPending,
    isFetching: result.isFetching,
    refresh: result.refetch,
    refetch: result.refetch,
  };
}

export function useEmployees() {
  const { scope, enabled } = useEmployeeQueryScope();
  const result = useQuery({
    ...employeesQuery(scope),
    enabled,
  });

  return {
    data: result.data ?? null,
    error: result.error,
    isLoading: result.data == null && result.isPending,
    isPending: result.isPending,
    isFetching: result.isFetching,
    refresh: result.refetch,
    refetch: result.refetch,
  };
}

export function useEmployee(employeeId: string) {
  const { scope, enabled } = useEmployeeQueryScope();
  const result = useQuery({
    ...employeeQuery(scope, employeeId),
    enabled: enabled && Boolean(employeeId),
  });

  return {
    data: result.data ?? null,
    error: result.error,
    isLoading: result.data == null && result.isPending,
    isPending: result.isPending,
    isFetching: result.isFetching,
    refresh: result.refetch,
    refetch: result.refetch,
  };
}

export function useEmployeeAppointmentStats(employeeId: string) {
  const { scope, enabled } = useEmployeeQueryScope();
  const result = useQuery({
    ...employeeStatsQuery(scope, employeeId),
    enabled: enabled && Boolean(employeeId),
  });

  return {
    data: result.data ?? null,
    error: result.error,
    isLoading: result.data == null && result.isPending,
    isPending: result.isPending,
    isFetching: result.isFetching,
    refresh: result.refetch,
    refetch: result.refetch,
  };
}

export function useEmployeeAppointments(employeeId: string) {
  const { scope, enabled } = useEmployeeQueryScope();
  const result = useQuery({
    ...employeeAppointmentsQuery(scope, employeeId),
    enabled: enabled && Boolean(employeeId),
  });

  return {
    data: result.data ?? null,
    error: result.error,
    isLoading: result.data == null && result.isPending,
    isPending: result.isPending,
    isFetching: result.isFetching,
    refresh: result.refetch,
    refetch: result.refetch,
  };
}

export function usePendingEmployeeInvitations() {
  const { scope, enabled } = useEmployeeQueryScope();
  const result = useQuery({
    ...employeeInvitationsQuery(scope),
    enabled,
  });

  return {
    data: result.data ?? null,
    error: result.error,
    isLoading: result.data == null && result.isPending,
    isPending: result.isPending,
    isFetching: result.isFetching,
    refresh: result.refetch,
    refetch: result.refetch,
  };
}

export function useCreateEmployee() {
  const queryClient = useQueryClient();
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
      queryClient.setQueryData<PendingEmployeeInvitation[]>(
        employeeKeys.invitations(scope),
        (current) => [invitation, ...(current ?? [])],
      );
      await queryClient.invalidateQueries({
        queryKey: employeeKeys.invitations(scope),
      });
    },
  });
}

export function useReplaceEmployeeInvitation() {
  const queryClient = useQueryClient();
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
      queryClient.setQueryData<PendingEmployeeInvitation[]>(
        employeeKeys.invitations(scope),
        (current) =>
          current?.map((entry) =>
            entry.id === invitationId ? invitation : entry,
          ) ?? [invitation],
      );
      await queryClient.invalidateQueries({
        queryKey: employeeKeys.invitations(scope),
      });
    },
  });
}

export function useCancelEmployeeInvitation() {
  const queryClient = useQueryClient();
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
      queryClient.setQueryData<PendingEmployeeInvitation[]>(
        employeeKeys.invitations(scope),
        (current) =>
          current?.filter((entry) => entry.id !== invitationId) ?? [],
      );
      await queryClient.invalidateQueries({
        queryKey: employeeKeys.invitations(scope),
      });
    },
  });
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient();
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
      setEmployeeQueryData(queryClient, scope, employee);
      await invalidateEmployeeDirectory(queryClient, scope);
    },
  });
}

export function useSetExternalMembershipStatus() {
  const queryClient = useQueryClient();
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
      queryClient.setQueryData<Employee>(
        employeeKeys.detail(scope, employeeId),
        (employee) =>
          employee ? { ...employee, active: status === "active" } : employee,
      );
      await invalidateEmployeeDirectory(queryClient, scope);
    },
  });
}
