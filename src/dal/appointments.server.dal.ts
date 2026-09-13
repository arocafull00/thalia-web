import "server-only";

import type {
  AppointmentPageParams,
  AppointmentPageResult,
  AppointmentRangeParams,
} from "@/dal/appointments.dal";
import {
  normalizeAppointment,
  normalizeAppointments,
} from "@/dal/price-normalizers";
import {
  APPOINTMENT_DETAIL_SELECT,
  APPOINTMENT_LIST_SELECT,
} from "@/dal/selects";
import { createClient } from "@/lib/supabase/server";
import {
  unwrapSupabase,
  unwrapSupabaseList,
  unwrapSupabaseNullable,
} from "@/lib/supabase-query";
import type {
  AppointmentWithRelations,
  ExternalAppointmentResponseInput,
  ExternalAppointmentResponseResult,
} from "@/types/database.types";

export async function getAppointmentsPage(
  params: AppointmentPageParams,
): Promise<AppointmentPageResult> {
  const supabase = await createClient();
  const offset = params.page * params.pageSize;

  let idsQuery = supabase
    .from("appointments_search")
    .select("id", { count: "exact" })
    .gte("starts_at", params.startIso)
    .lte("starts_at", params.endIso)
    .order("starts_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + params.pageSize - 1);

  if (params.employeeId) {
    idsQuery = idsQuery.eq("employee_id", params.employeeId);
  }

  if (params.clinicId) {
    idsQuery = idsQuery.eq("clinic_id", params.clinicId);
  }

  if (params.status) {
    idsQuery = idsQuery.eq("status", params.status);
  }

  const search = params.search.trim().toLowerCase();

  if (search) {
    idsQuery = idsQuery.ilike("search_text", `%${search}%`);
  }

  const { data: idRows, error: idsError, count } = await idsQuery;
  const ids = (unwrapSupabaseList(idRows, idsError) as { id: string }[]).map(
    (row) => row.id,
  );

  if (ids.length === 0) {
    return { appointments: [], total: count ?? 0 };
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_LIST_SELECT)
    .in("id", ids);

  const rows = normalizeAppointments(
    unwrapSupabaseList(data, error) as Record<string, unknown>[],
  );
  const position = new Map(ids.map((id, index) => [id, index]));

  return {
    appointments: rows.toSorted(
      (left, right) =>
        (position.get(left.id) ?? 0) - (position.get(right.id) ?? 0),
    ),
    total: count ?? 0,
  };
}

export async function getAppointments(
  params: AppointmentRangeParams,
): Promise<AppointmentWithRelations[]> {
  const supabase = await createClient();
  let query = supabase
    .from("appointments")
    .select(APPOINTMENT_LIST_SELECT)
    .gte("starts_at", params.startIso)
    .lte("starts_at", params.endIso)
    .order("starts_at");

  if (params.employeeId) {
    query = query.eq("employee_id", params.employeeId);
  }

  if (params.clinicId) {
    query = query.eq("clinic_id", params.clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as AppointmentWithRelations[];
}

export async function getAppointment(
  appointmentId: string,
): Promise<AppointmentWithRelations | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_DETAIL_SELECT)
    .eq("id", appointmentId)
    .maybeSingle();
  const appointment = unwrapSupabaseNullable(data, error) as Record<
    string,
    unknown
  > | null;
  return appointment ? normalizeAppointment(appointment) : null;
}

export async function respondExternalAppointment(
  clinicId: string,
  input: ExternalAppointmentResponseInput,
): Promise<ExternalAppointmentResponseResult> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("respond_external_appointment", {
    p_appointment_id: input.appointmentId,
    p_clinic_id: clinicId,
    p_decision: input.decision,
    p_allow_overlap: input.allowOverlap,
    p_expected_updated_at: input.expectedUpdatedAt,
  });

  return unwrapSupabase(data, error) as ExternalAppointmentResponseResult;
}
