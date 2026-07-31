import "server-only";

import type {
  EmployeeAppointmentRow,
  EmployeeAppointmentStats,
} from "@/dal/employees.dal";
import { createClient } from "@/lib/supabase/server";
import {
  unwrapSupabaseList,
  unwrapSupabaseNullable,
} from "@/lib/supabase-query";
import type { Employee } from "@/types/database.types";

export async function getEmployees(
  clinicId: string | null,
): Promise<Employee[]> {
  const supabase = await createClient();
  let query = supabase.from("employees").select("*").order("full_name");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as Employee[];
}

export async function getEmployee(
  employeeId: string,
): Promise<Employee | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", employeeId)
    .maybeSingle();
  return unwrapSupabaseNullable(data, error);
}

export async function getEmployeeAppointments(
  employeeId: string,
): Promise<EmployeeAppointmentRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*, patients(id, full_name)")
    .eq("employee_id", employeeId)
    .order("starts_at", { ascending: false })
    .limit(50);
  return unwrapSupabaseList(data, error) as EmployeeAppointmentRow[];
}

export async function getEmployeeAppointmentStats(
  employeeId: string,
): Promise<EmployeeAppointmentStats> {
  const supabase = await createClient();
  const now = new Date().toISOString();
  const [totalResult, completedResult, upcomingResult, cancelledResult] =
    await Promise.all([
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

  if (totalResult.error) throw totalResult.error;
  if (completedResult.error) throw completedResult.error;
  if (upcomingResult.error) throw upcomingResult.error;
  if (cancelledResult.error) throw cancelledResult.error;

  return {
    total: totalResult.count ?? 0,
    completed: completedResult.count ?? 0,
    upcoming: upcomingResult.count ?? 0,
    cancelled: cancelledResult.count ?? 0,
  };
}
