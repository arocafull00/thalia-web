import "server-only";

import type { AppointmentRangeParams } from "@/dal/appointments.dal";
import {
  APPOINTMENT_DETAIL_SELECT,
  APPOINTMENT_LIST_SELECT,
} from "@/dal/selects";
import { createClient } from "@/lib/supabase/server";
import {
  unwrapSupabaseList,
  unwrapSupabaseNullable,
} from "@/lib/supabase-query";
import type { AppointmentWithRelations } from "@/types/database.types";

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
  return unwrapSupabaseNullable(data, error) as AppointmentWithRelations | null;
}
