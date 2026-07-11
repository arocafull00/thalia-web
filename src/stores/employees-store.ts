import { create } from "zustand";

import {
  getEmployee,
  getEmployeeAppointments,
  getEmployeeAppointmentStats,
  getEmployees,
  inviteEmployee,
  updateEmployee,
  type EmployeeAppointmentRow,
  type EmployeeAppointmentStats,
} from "@/dal/employees.dal";
import { getActiveClinicId } from "@/lib/active-clinic-id";
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

type EmployeesStore = {
  list: QueryEntry<Employee[]>;
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
  fetchEmployee: (employeeId: string) => Promise<void>;
  fetchEmployeeStats: (employeeId: string) => Promise<void>;
  fetchEmployeeAppointments: (employeeId: string) => Promise<void>;
  createEmployee: (input: CreateEmployeeInput) => Promise<Employee>;
  updateEmployee: (id: string, values: Partial<Employee>) => Promise<Employee>;
};

export const useEmployeesStore = create<EmployeesStore>((set, get) => ({
  list: emptyQueryEntry(),
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
      set({
        list: errorQueryEntry(
          cause instanceof Error ? cause : new Error(String(cause)),
          get().list,
        ),
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
      await get().fetchEmployees();
      set({ creating: false });
      return employee;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
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
      await get().fetchEmployees();
      await get().fetchEmployee(id);
      set({ updating: false });
      return employee;
    } catch (cause) {
      const error = cause instanceof Error ? cause : new Error(String(cause));
      set({ updating: false, updateError: error });
      throw error;
    }
  },
}));
