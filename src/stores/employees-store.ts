import { create } from "zustand";

import {
  getEmployee,
  getEmployeeAppointments,
  getEmployeeAppointmentStats,
  getEmployees,
  getEmployeesPage,
  inviteEmployee,
  updateEmployee,
  type EmployeeAppointmentRow,
  type EmployeeAppointmentStats,
  type EmployeePageParams,
  type EmployeePageResult,
} from "@/dal/employees.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
import { logger } from "@/lib/logger";
import {
  employeeInviteSchema,
  employeeUpdateSchema,
} from "@/lib/schemas/employee-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type {
  ClinicMembershipInvitationRole,
  Employee,
} from "@/types/database.types";

export type { EmployeeAppointmentRow, EmployeeAppointmentStats };

export type CreateEmployeeInput = {
  email: string;
  role: ClinicMembershipInvitationRole;
};

export type EmployeesPageQuery = Omit<EmployeePageParams, "clinicId">;

export function employeesPageKey(query: EmployeesPageQuery) {
  return JSON.stringify({
    search: query.search.trim().toLowerCase(),
    role: query.role,
    active: query.active,
    page: query.page,
    pageSize: query.pageSize,
  });
}

type EmployeesStore = {
  /**
   * Lista completa de la clínica. **No** se sustituye por `byPage`: la
   * consumen el selector de profesional en citas, el calendario y ajustes, que
   * necesitan todos los empleados para pintar sus rejillas y desplegables.
   */
  list: QueryEntry<Employee[]>;
  byPage: Record<string, QueryEntry<EmployeePageResult>>;
  byId: Record<string, QueryEntry<Employee>>;
  statsByEmployeeId: Record<string, QueryEntry<EmployeeAppointmentStats>>;
  appointmentsByEmployeeId: Record<
    string,
    QueryEntry<EmployeeAppointmentRow[]>
  >;
  creating: boolean;
  createError: Error | null;
  updating: boolean;
  updateError: Error | null;
  fetchEmployees: () => Promise<void>;
  fetchEmployeesPage: (query: EmployeesPageQuery) => Promise<void>;
  seedEmployeesPage: (
    query: EmployeesPageQuery,
    result: EmployeePageResult,
  ) => void;
  fetchEmployee: (employeeId: string) => Promise<void>;
  fetchEmployeeStats: (employeeId: string) => Promise<void>;
  fetchEmployeeAppointments: (employeeId: string) => Promise<void>;
  createEmployee: (input: CreateEmployeeInput) => Promise<Employee>;
  updateEmployee: (id: string, values: Partial<Employee>) => Promise<Employee>;
};

/**
 * Refresco tras invitar, editar o cambiar el estado de un empleado. Vuelve a
 * pedir las páginas en caché y la lista completa que usan el calendario y los
 * diálogos de citas.
 *
 * Hace falta releer el total: al invitar a alguien «1-10 de 12» pasa a «de 13»,
 * y parchear el elemento en memoria no lo actualizaría. Cambiar el estado
 * además mueve al empleado de un filtro al otro.
 */
async function refreshEmployeeQueries(get: () => EmployeesStore) {
  const { byPage, fetchEmployees, fetchEmployeesPage } = get();

  await Promise.all([
    fetchEmployees(),
    ...Object.keys(byPage).map((key) =>
      fetchEmployeesPage(JSON.parse(key) as EmployeesPageQuery),
    ),
  ]);
}

export const useEmployeesStore = create<EmployeesStore>((set, get) => ({
  list: emptyQueryEntry(),
  byPage: {},
  byId: {},
  statsByEmployeeId: {},
  appointmentsByEmployeeId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,

  fetchEmployees: async () => {
    set({ list: loadingQueryEntry(get().list) });

    try {
      const clinicId = getActiveClinicId();
      const employees = await getEmployees(clinicId);
      set({ list: successQueryEntry(employees) });
    } catch (cause) {
      logger.captureException(cause, {
        store: "employees-store",
        action: "fetchEmployees",
        clinicId: getActiveClinicId(),
      });
      set({
        list: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().list,
        ),
      });
    }
  },

  seedEmployeesPage: (query, result) => {
    const key = employeesPageKey(query);

    set((state) => {
      // La siembra sólo rellena huecos: si ya hay datos de cliente para esta
      // página, son más frescos que los del servidor.
      if (state.byPage[key]?.data != null) {
        return state;
      }

      return { byPage: { ...state.byPage, [key]: successQueryEntry(result) } };
    });
  },

  fetchEmployeesPage: async (query) => {
    const key = employeesPageKey(query);
    const previous = get().byPage[key];
    set({ byPage: { ...get().byPage, [key]: loadingQueryEntry(previous) } });

    try {
      const result = await getEmployeesPage({
        ...query,
        clinicId: getActiveClinicId(),
      });
      set({ byPage: { ...get().byPage, [key]: successQueryEntry(result) } });
    } catch (cause) {
      logger.captureException(cause, {
        store: "employees-store",
        action: "fetchEmployeesPage",
        clinicId: getActiveClinicId(),
      });
      set({
        byPage: {
          ...get().byPage,
          [key]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchEmployee: async (employeeId) => {
    const previous = get().byId[employeeId];
    set({ byId: { ...get().byId, [employeeId]: loadingQueryEntry(previous) } });

    try {
      const employee = await getEmployee(employeeId);
      set({
        byId: { ...get().byId, [employeeId]: successQueryEntry(employee) },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "employees-store",
        action: "fetchEmployee",
        employeeId,
      });
      set({
        byId: {
          ...get().byId,
          [employeeId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchEmployeeAppointments: async (employeeId) => {
    const previous = get().appointmentsByEmployeeId[employeeId];
    set({
      appointmentsByEmployeeId: {
        ...get().appointmentsByEmployeeId,
        [employeeId]: loadingQueryEntry(previous),
      },
    });

    try {
      const appointments = await getEmployeeAppointments(employeeId);
      set({
        appointmentsByEmployeeId: {
          ...get().appointmentsByEmployeeId,
          [employeeId]: successQueryEntry(appointments),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "employees-store",
        action: "fetchEmployeeAppointments",
        employeeId,
      });
      set({
        appointmentsByEmployeeId: {
          ...get().appointmentsByEmployeeId,
          [employeeId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  fetchEmployeeStats: async (employeeId) => {
    const previous = get().statsByEmployeeId[employeeId];
    set({
      statsByEmployeeId: {
        ...get().statsByEmployeeId,
        [employeeId]: loadingQueryEntry(previous),
      },
    });

    try {
      const stats = await getEmployeeAppointmentStats(employeeId);
      set({
        statsByEmployeeId: {
          ...get().statsByEmployeeId,
          [employeeId]: successQueryEntry(stats),
        },
      });
    } catch (cause) {
      logger.captureException(cause, {
        store: "employees-store",
        action: "fetchEmployeeStats",
        employeeId,
      });
      set({
        statsByEmployeeId: {
          ...get().statsByEmployeeId,
          [employeeId]: errorQueryEntry(
            cause instanceof Error ? cause : new Error(String(cause)),
            previous,
          ),
        },
      });
    }
  },

  createEmployee: async (input) => {
    set({ creating: true, createError: null });

    try {
      const parsed = employeeInviteSchema.safeParse(input);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      const clinicId = getActiveClinicId();
      if (!clinicId) throw new Error("No hay clínica activa");
      const employee = await inviteEmployee({ ...parsed.data, clinicId });
      await refreshEmployeeQueries(get);
      set({ creating: false });
      return employee;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "employees-store",
        action: "createEmployee",
        clinicId: getActiveClinicId(),
      });
      set({ creating: false, createError: error });
      throw error;
    }
  },

  updateEmployee: async (id, values) => {
    set({ updating: true, updateError: null });

    try {
      const parsed = employeeUpdateSchema.safeParse(values);

      if (!parsed.success) {
        throw new Error(formatZodError(parsed.error));
      }

      const employee = await updateEmployee(id, parsed.data);
      await refreshEmployeeQueries(get);
      await get().fetchEmployee(id);
      set({ updating: false });
      return employee;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      logger.captureException(error, {
        store: "employees-store",
        action: "updateEmployee",
        employeeId: id,
      });
      set({ updating: false, updateError: error });
      throw error;
    }
  },
}));
