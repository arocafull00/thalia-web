import { create } from "zustand";
import { persist } from "zustand/middleware";

import {
  getEmployee,
  getEmployeeAppointments,
  getEmployeeAppointmentStats,
  getEmployees,
  getEmployeesPage,
  getPendingEmployeeInvitations,
  type EmployeeAppointmentRow,
  type EmployeeAppointmentStats,
  type EmployeePageResult,
} from "@/dal/employees.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import {
  normalizeEmployeesPageQuery,
  type EmployeesPageQuery,
} from "@/lib/query/employees-query";
import { clinicPersistOptions } from "@/stores/clinic-query-persist";
import { getQueryEpoch, isCurrentQueryEpoch } from "@/stores/query-epoch";
import {
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { Employee, PendingEmployeeInvitation } from "@/types/database.types";

export const employeesListKey = "list";
export const employeeInvitationsKey = "invitations";
export const employeesPageKey = (query: EmployeesPageQuery) =>
  `page:${JSON.stringify(normalizeEmployeesPageQuery(query))}`;
export const employeeDetailKey = (id: string) => `detail:${id}`;
export const employeeStatsKey = (id: string) => `stats:${id}`;
export const employeeAppointmentsKey = (id: string) => `appointments:${id}`;

type EmployeesStore = {
  queries: Record<string, QueryEntry<unknown>>;
  fetchEmployees: () => Promise<void>;
  fetchEmployeesPage: (query: EmployeesPageQuery) => Promise<void>;
  fetchEmployee: (id: string) => Promise<void>;
  fetchStats: (id: string) => Promise<void>;
  fetchAppointments: (id: string) => Promise<void>;
  fetchInvitations: () => Promise<void>;
  updateEmployeeData: (employee: Employee) => void;
  updateExternalStatus: (id: string, active: boolean) => void;
  updateInvitations: (
    update: (current: PendingEmployeeInvitation[]) => PendingEmployeeInvitation[],
  ) => void;
  refreshDirectory: () => Promise<void>;
};

export const useEmployeesStore = create<EmployeesStore>()(
  persist(
    (set, get) => {
      const run = async <T>(key: string, query: (clinicId: string) => Promise<T>) => {
        const clinicId = getActiveClinicId();
        if (!clinicId) return;
        const epoch = getQueryEpoch();
        const previous = get().queries[key] as QueryEntry<T> | undefined;
        set({ queries: { ...get().queries, [key]: loadingQueryEntry(previous) } });

        try {
          const value = await query(clinicId);
          if (!isCurrentQueryEpoch(epoch)) return;
          set({
            queries: {
              ...get().queries,
              [key]: successQueryEntry(value, previous),
            },
          });
        } catch (cause) {
          if (!isCurrentQueryEpoch(epoch)) return;
          logger.captureException(cause, { store: "employees-store", key });
          set({
            queries: {
              ...get().queries,
              [key]: errorQueryEntry(
                cause instanceof Error ? cause : new Error(String(cause)),
                previous,
              ),
            },
          });
        }
      };

      return {
        queries: {},
        fetchEmployees: () =>
          run(employeesListKey, (clinicId) => getEmployees(clinicId)),
        fetchEmployeesPage: (query) =>
          run(employeesPageKey(query), (clinicId) =>
            getEmployeesPage({ ...query, clinicId }),
          ),
        fetchEmployee: (id) =>
          run(employeeDetailKey(id), (clinicId) => getEmployee(id, clinicId)),
        fetchStats: (id) =>
          run(employeeStatsKey(id), (clinicId) =>
            getEmployeeAppointmentStats(id, clinicId),
          ),
        fetchAppointments: (id) =>
          run(employeeAppointmentsKey(id), (clinicId) =>
            getEmployeeAppointments(id, clinicId),
          ),
        fetchInvitations: () =>
          run(employeeInvitationsKey, (clinicId) =>
            getPendingEmployeeInvitations(clinicId),
          ),
        updateEmployeeData: (employee) => {
          const queries = { ...get().queries };
          queries[employeeDetailKey(employee.id)] = successQueryEntry(employee);
          for (const [key, entry] of Object.entries(queries)) {
            if (key === employeesListKey && Array.isArray(entry.data)) {
              queries[key] = successQueryEntry(
                (entry.data as Employee[]).map((item) =>
                  item.id === employee.id ? employee : item,
                ),
              );
            }
            if (key.startsWith("page:") && entry.data) {
              const page = entry.data as EmployeePageResult;
              queries[key] = successQueryEntry({
                ...page,
                employees: page.employees.map((item) =>
                  item.id === employee.id ? employee : item,
                ),
              });
            }
          }
          set({ queries });
        },
        updateExternalStatus: (id, active) => {
          const entry = get().queries[employeeDetailKey(id)] as
            | QueryEntry<Employee>
            | undefined;
          if (entry?.data) {
            get().updateEmployeeData({ ...entry.data, active });
          }
        },
        updateInvitations: (update) => {
          const previous = get().queries[employeeInvitationsKey] as
            | QueryEntry<PendingEmployeeInvitation[]>
            | undefined;
          set({
            queries: {
              ...get().queries,
              [employeeInvitationsKey]: successQueryEntry(
                update(previous?.data ?? []),
              ),
            },
          });
        },
        refreshDirectory: async () => {
          await Promise.all(
            Object.keys(get().queries).flatMap((key) => {
              if (key === employeesListKey) return [get().fetchEmployees()];
              if (key.startsWith("page:")) {
                return [
                  get().fetchEmployeesPage(
                    JSON.parse(key.slice(5)) as EmployeesPageQuery,
                  ),
                ];
              }
              return [];
            }),
          );
        },
      };
    },
    clinicPersistOptions<EmployeesStore>("employees", ["queries"]),
  ),
);

export type { EmployeeAppointmentRow, EmployeeAppointmentStats };
