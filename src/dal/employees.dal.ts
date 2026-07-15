import { createEmployeeInviteError } from "@/lib/employee-invite-errors";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  Appointment,
  ClinicMembershipInvitationRole,
  Employee,
} from "@/types/database.types";

export type EmployeeAppointmentRow = Appointment & {
  patients: { id: string; full_name: string } | null;
};

export type EmployeeAppointmentStats = {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
};

export type EmployeeInviteInput = {
  email: string;
  role: ClinicMembershipInvitationRole;
  clinicId: string;
};

export type EmployeeUpdate = Partial<
  Pick<
    Employee,
    "full_name" | "phone" | "specialty" | "color" | "role" | "active"
  >
>;

export async function getEmployees(
  clinicId: string | null,
): Promise<Employee[]> {
  let query = supabase.from("employees").select("*").order("full_name");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as Employee[];
}

export async function getEmployee(employeeId: string): Promise<Employee> {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", employeeId)
    .single();
  return unwrapSupabase(data, error) as Employee;
}

export async function getEmployeeAppointments(
  employeeId: string,
): Promise<EmployeeAppointmentRow[]> {
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

export async function inviteEmployee(
  input: EmployeeInviteInput,
): Promise<Employee> {
  const { data, error } = await supabase.functions.invoke<Employee>(
    "invite-employee",
    { body: input },
  );

  if (error) {
    throw await createEmployeeInviteError(error);
  }

  return unwrapSupabase(data, error);
}

export async function updateEmployee(
  id: string,
  values: EmployeeUpdate,
): Promise<Employee> {
  const { data, error } = await supabase
    .from("employees")
    .update(values)
    .eq("id", id)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Employee;
}
