import { create } from "zustand";

import { getActiveClinicId } from "@/lib/active-clinic-id";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import {
  emptyQueryEntry,
  errorQueryEntry,
  loadingQueryEntry,
  successQueryEntry,
  type QueryEntry,
} from "@/stores/query-state";
import type { Employee, EmployeeRole } from "@/types/database.types";

export type CreateEmployeeInput = {
  clinicId: string;
  email: string;
  fullName: string;
  role: EmployeeRole;
  specialty: string | null;
  color: string | null;
  phone: string | null;
};

export type EmployeeAppointmentStats = {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
};

type EmployeesStore = {
  list: QueryEntry<Employee[]>;
  byId: Record<string, QueryEntry<Employee>>;
  statsByEmployeeId: Record<string, QueryEntry<EmployeeAppointmentStats>>;
  creating: boolean;
  createError: Error | null;
  updating: boolean;
  updateError: Error | null;
  fetchEmployees: () => Promise<void>;
  fetchEmployee: (employeeId: string) => Promise<void>;
  fetchEmployeeStats: (employeeId: string) => Promise<void>;
  createEmployee: (input: CreateEmployeeInput) => Promise<Employee>;
  updateEmployee: (id: string, values: Partial<Employee>) => Promise<Employee>;
};

export const useEmployeesStore = create<EmployeesStore>((set, get) => ({
  list: emptyQueryEntry(),
  byId: {},
  statsByEmployeeId: {},
  creating: false,
  createError: null,
  updating: false,
  updateError: null,

  fetchEmployees: async () => {
    set({ list: loadingQueryEntry(get().list) });

    try {
      const clinicId = getActiveClinicId();
      let query = supabase.from("employees").select("*").order("full_name");

      if (clinicId) {
        query = query.eq("clinic_id", clinicId);
      }

      const { data, error } = await query;
      const employees = unwrapSupabaseList(data, error) as Employee[];
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
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("id", employeeId)
        .single();
      const employee = unwrapSupabase(data, error) as Employee;
      set({ byId: { ...get().byId, [employeeId]: successQueryEntry(employee) } });
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

  fetchEmployeeStats: async (employeeId) => {
    const previous = get().statsByEmployeeId[employeeId];
    set({
      statsByEmployeeId: { ...get().statsByEmployeeId, [employeeId]: loadingQueryEntry(previous) },
    });

    try {
      const now = new Date().toISOString();
      const [totalResult, completedResult, upcomingResult, cancelledResult] = await Promise.all([
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("employee_id", employeeId),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("employee_id", employeeId)
          .eq("status", "completed"),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("employee_id", employeeId)
          .gte("starts_at", now)
          .in("status", ["scheduled", "confirmed", "in_progress"]),
        supabase
          .from("appointments")
          .select("*", { count: "exact", head: true })
          .eq("employee_id", employeeId)
          .in("status", ["cancelled", "no_show"]),
      ]);

      if (totalResult.error) {
        throw totalResult.error;
      }

      if (completedResult.error) {
        throw completedResult.error;
      }

      if (upcomingResult.error) {
        throw upcomingResult.error;
      }

      if (cancelledResult.error) {
        throw cancelledResult.error;
      }

      const stats: EmployeeAppointmentStats = {
        total: totalResult.count ?? 0,
        completed: completedResult.count ?? 0,
        upcoming: upcomingResult.count ?? 0,
        cancelled: cancelledResult.count ?? 0,
      };

      set({
        statsByEmployeeId: { ...get().statsByEmployeeId, [employeeId]: successQueryEntry(stats) },
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
      const { data, error } = await supabase.functions.invoke<Employee>("invite-employee", {
        body: input,
      });
      const employee = unwrapSupabase(data, error);
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
      const { data, error } = await supabase
        .from("employees")
        .update(values)
        .eq("id", id)
        .select("*")
        .single();
      const employee = unwrapSupabase(data, error) as Employee;
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
