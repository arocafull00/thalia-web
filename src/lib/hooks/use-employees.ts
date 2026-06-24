import { useCallback, useEffect } from "react";

import { useEmployeesStore, type CreateEmployeeInput } from "@/stores/employees-store";
import type { Employee } from "@/types/database.types";

export type { CreateEmployeeInput };

export function useEmployees() {
  const entry = useEmployeesStore((state) => state.list);
  const fetchEmployees = useEmployeesStore((state) => state.fetchEmployees);

  useEffect(() => {
    void fetchEmployees();
  }, [fetchEmployees]);

  return {
    data: entry.data ?? undefined,
    isLoading: entry.loading,
    error: entry.error,
    refresh: fetchEmployees,
  };
}

export function useEmployee(employeeId: string) {
  const entry = useEmployeesStore((state) => state.byId[employeeId]);
  const fetchEmployee = useEmployeesStore((state) => state.fetchEmployee);

  useEffect(() => {
    void fetchEmployee(employeeId);
  }, [employeeId, fetchEmployee]);

  return {
    data: entry?.data,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function useEmployeeAppointmentStats(employeeId: string) {
  const entry = useEmployeesStore((state) => state.statsByEmployeeId[employeeId]);
  const fetchEmployeeStats = useEmployeesStore((state) => state.fetchEmployeeStats);

  useEffect(() => {
    void fetchEmployeeStats(employeeId);
  }, [employeeId, fetchEmployeeStats]);

  return {
    data: entry?.data,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function useCreateEmployee() {
  const createEmployee = useEmployeesStore((state) => state.createEmployee);
  const isPending = useEmployeesStore((state) => state.creating);
  const error = useEmployeesStore((state) => state.createError);

  const mutate = useCallback(
    (
      input: CreateEmployeeInput,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      createEmployee(input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(cause instanceof Error ? cause : new Error(String(cause))),
        );
    },
    [createEmployee],
  );

  return { mutate, isPending, error };
}

export function useUpdateEmployee() {
  const updateEmployee = useEmployeesStore((state) => state.updateEmployee);
  const isPending = useEmployeesStore((state) => state.updating);
  const error = useEmployeesStore((state) => state.updateError);

  const mutate = useCallback(
    (
      { id, values }: { id: string; values: Partial<Employee> },
      options?: { onSuccess?: () => void },
    ) => {
      updateEmployee(id, values).then(() => options?.onSuccess?.());
    },
    [updateEmployee],
  );

  return { mutate, isPending, error };
}
