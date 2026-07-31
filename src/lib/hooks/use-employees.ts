import { useCallback, useEffect } from "react";

import type {
  EmployeeAppointmentRow,
  EmployeeAppointmentStats,
} from "@/dal/employees.dal";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useClinicServerSeed,
  useServerSeed,
} from "@/lib/hooks/use-server-seed";
import {
  useEmployeesStore,
  type CreateEmployeeInput,
} from "@/stores/employees-store";
import { isInitialLoading } from "@/stores/query-state";
import type { Employee } from "@/types/database.types";

export type { CreateEmployeeInput };

export function useEmployees(initialData?: Employee[]) {
  const entry = useEmployeesStore((state) => state.list);
  const fetchEmployees = useEmployeesStore((state) => state.fetchEmployees);
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchEmployees();
  }, [clinicId, fetchEmployees, hasClientData, seededData]);

  const data = entry.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry.error,
    refresh: fetchEmployees,
  };
}

export function useEmployee(employeeOrId: Employee | string) {
  const employeeId =
    typeof employeeOrId === "string" ? employeeOrId : employeeOrId.id;
  const initialData =
    typeof employeeOrId === "string" ? undefined : employeeOrId;
  const entry = useEmployeesStore((state) => state.byId[employeeId]);
  const fetchEmployee = useEmployeesStore((state) => state.fetchEmployee);
  const seededData = useServerSeed(
    employeeId,
    initialData?.id ?? "",
    initialData,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchEmployee(employeeId);
  }, [employeeId, fetchEmployee, hasClientData, seededData]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useEmployeeAppointmentStats(
  employeeId: string,
  initialData?: EmployeeAppointmentStats,
) {
  const entry = useEmployeesStore(
    (state) => state.statsByEmployeeId[employeeId],
  );
  const fetchEmployeeStats = useEmployeesStore(
    (state) => state.fetchEmployeeStats,
  );
  const seededData = useServerSeed(
    employeeId,
    initialData === undefined ? "" : employeeId,
    initialData,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchEmployeeStats(employeeId);
  }, [employeeId, fetchEmployeeStats, hasClientData, seededData]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useEmployeeAppointments(
  employeeId: string,
  initialData?: EmployeeAppointmentRow[],
) {
  const entry = useEmployeesStore(
    (state) => state.appointmentsByEmployeeId[employeeId],
  );
  const fetchEmployeeAppointments = useEmployeesStore(
    (state) => state.fetchEmployeeAppointments,
  );
  const seededData = useServerSeed(
    employeeId,
    initialData === undefined ? "" : employeeId,
    initialData,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchEmployeeAppointments(employeeId);
  }, [employeeId, fetchEmployeeAppointments, hasClientData, seededData]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
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
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
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
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      updateEmployee(id, values)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [updateEmployee],
  );

  return { mutate, isPending, error };
}
