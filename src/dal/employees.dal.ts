import { createEmployeeInviteError } from "@/lib/employee-invite-errors";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  Appointment,
  ClinicMembershipInvitationRole,
  Employee,
  PendingEmployeeInvitation,
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

export type EmployeeInvitationMutationInput = EmployeeInviteInput & {
  invitationId: string;
};

export type EmployeeInvitationCancelInput = {
  clinicId: string;
  invitationId: string;
};

export type InvitationLookupRow = {
  token: string;
  email: string;
  role: ClinicMembershipInvitationRole;
  expires_at: string;
  clinics: { name: string } | { name: string }[] | null;
};

export type InvitationTokenLookup = Omit<InvitationLookupRow, "token"> & {
  used_at: string | null;
};

export type EmployeeUpdate = Partial<
  Pick<
    Employee,
    "full_name" | "phone" | "specialty" | "color" | "role" | "active"
  >
>;

export type EmployeePageParams = {
  clinicId: string | null;
  search: string;
  role: string;
  /** `null` es «sin filtrar»; `false` filtra los dados de baja. */
  active: boolean | null;
  page: number;
  pageSize: number;
};

export type EmployeePageResult = {
  employees: Employee[];
  total: number;
};

const EMPLOYEE_CLINIC_SELECT =
  "*, clinic_memberships!clinic_memberships_employee_fkey!inner(clinic_id, status)";

/**
 * Aplica el filtro de estado tal y como lo entendía el cliente: `active` admite
 * nulos y un nulo cuenta como activo, así que «activos» es `IS NOT FALSE` y no
 * `= true`. Con `eq` desaparecerían de la lista los empleados antiguos que
 * nunca han tenido el campo puesto.
 */
const ACTIVE_FILTER = { column: "active", value: false } as const;

export async function getEmployees(
  clinicId: string | null,
): Promise<Employee[]> {
  let query = supabase
    .from("employees")
    .select(EMPLOYEE_CLINIC_SELECT)
    .order("full_name");

  if (clinicId) {
    query = query
      .eq("clinic_memberships.clinic_id", clinicId)
      .eq("clinic_memberships.status", "active");
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as Employee[];
}

/**
 * Página del listado de personal, filtrada y ordenada en servidor.
 *
 * Sin vista SQL: la búsqueda mira `full_name` y `specialty` —dos columnas de la
 * misma tabla, que PostgREST sí sabe combinar con `or`— y los filtros son
 * `role` y `active`.
 */
export async function getEmployeesPage(
  params: EmployeePageParams,
): Promise<EmployeePageResult> {
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("employees")
    .select(EMPLOYEE_CLINIC_SELECT, { count: "exact" })
    .order("full_name")
    // Desempate estable: sin esto, dos empleados homónimos pueden cambiar de
    // orden entre páginas y una fila se repetiría o se perdería.
    .order("id")
    .range(offset, offset + params.pageSize - 1);

  if (params.clinicId) {
    query = query
      .eq("clinic_memberships.clinic_id", params.clinicId)
      .eq("clinic_memberships.status", "active");
  }

  if (params.role) {
    query = query.eq("role", params.role);
  }

  if (params.active === true) {
    query = query.not(ACTIVE_FILTER.column, "is", ACTIVE_FILTER.value);
  }

  if (params.active === false) {
    query = query.is(ACTIVE_FILTER.column, ACTIVE_FILTER.value);
  }

  const search = params.search.trim();

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,specialty.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  return {
    employees: unwrapSupabaseList(data, error) as Employee[],
    total: count ?? 0,
  };
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
): Promise<PendingEmployeeInvitation> {
  const { data, error } =
    await supabase.functions.invoke<PendingEmployeeInvitation>(
    "invite-employee",
    { body: input },
  );

  if (error) {
    throw await createEmployeeInviteError(error);
  }

  return unwrapSupabase(data, error);
}

export async function getPendingEmployeeInvitations(
  clinicId: string,
): Promise<PendingEmployeeInvitation[]> {
  const { data, error } = await supabase
    .from("invitation_tokens")
    .select("id, email, role, created_at, expires_at")
    .eq("clinic_id", clinicId)
    .is("used_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: false });

  return unwrapSupabaseList(data, error) as PendingEmployeeInvitation[];
}

export async function replaceEmployeeInvitation(
  input: EmployeeInvitationMutationInput,
): Promise<PendingEmployeeInvitation> {
  const { data, error } =
    await supabase.functions.invoke<PendingEmployeeInvitation>(
      "invite-employee",
      { body: { ...input, action: "replace" } },
    );

  if (error) {
    throw await createEmployeeInviteError(error);
  }

  return unwrapSupabase(data, error);
}

export async function cancelEmployeeInvitation(
  input: EmployeeInvitationCancelInput,
): Promise<void> {
  const { error } = await supabase.functions.invoke("invite-employee", {
    body: { ...input, action: "cancel" },
  });

  if (error) {
    throw await createEmployeeInviteError(error);
  }
}

export async function lookupEmployeeInvitationsByEmail(
  email: string,
): Promise<InvitationLookupRow[]> {
  const { data, error } = await supabase.functions.invoke<{
    invitations: InvitationLookupRow[];
  }>("lookup-employee-invitation", { body: { email } });

  if (error) throw error;
  return data?.invitations ?? [];
}

export async function lookupEmployeeInvitationByToken(
  token: string,
): Promise<InvitationTokenLookup | null> {
  const { data, error } = await supabase.functions.invoke<{
    invitation: InvitationTokenLookup | null;
  }>("lookup-employee-invitation", { body: { token } });

  if (error) throw error;
  return data?.invitation ?? null;
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

export async function setExternalMembershipStatus(
  employeeId: string,
  clinicId: string,
  status: "active" | "suspended",
): Promise<void> {
  const { error } = await supabase.rpc("set_external_membership_status", {
    p_employee_id: employeeId,
    p_clinic_id: clinicId,
    p_status: status,
  });

  if (error) {
    throw error;
  }
}
