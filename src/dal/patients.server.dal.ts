import "server-only";

import type { PatientPageParams, PatientPageResult } from "@/dal/patients.dal";
import { APPOINTMENT_LIST_SELECT } from "@/dal/selects";
import { createClient } from "@/lib/supabase/server";
import {
  unwrapSupabaseList,
  unwrapSupabaseNullable,
} from "@/lib/supabase-query";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

/**
 * Misma consulta que `getPatientsPage` del DAL de navegador, con el cliente de
 * servidor, para sembrar la primera página desde el Server Component.
 *
 * Se duplica en lugar de compartirse porque cada uno usa un cliente distinto;
 * cualquier cambio en el filtrado hay que replicarlo en los dos.
 */
export async function getPatientsPage(
  params: PatientPageParams,
): Promise<PatientPageResult> {
  const supabase = await createClient();
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("patients")
    .select("*", { count: "exact" })
    .order("full_name")
    .order("id")
    .range(offset, offset + params.pageSize - 1);

  if (params.clinicId) {
    query = query.eq("clinic_id", params.clinicId);
  }

  if (params.marketingOptIn !== null) {
    query = query.eq("marketing_opt_in", params.marketingOptIn);
  }

  const search = params.search.trim();

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,phone.ilike.%${search}%`);
  }

  const { data, error, count } = await query;

  return {
    patients: unwrapSupabaseList(data, error) as Patient[],
    total: count ?? 0,
  };
}

export async function getPatients(
  clinicId: string | null,
  search: string,
): Promise<Patient[]> {
  const supabase = await createClient();
  let query = supabase.from("patients").select("*").order("full_name");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  if (search.trim()) {
    query = query.or(
      `full_name.ilike.%${search.trim()}%,phone.ilike.%${search.trim()}%`,
    );
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as Patient[];
}

export async function getPatient(patientId: string): Promise<Patient | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .maybeSingle();
  return unwrapSupabaseNullable(data, error);
}

export async function getPatientAppointments(
  patientId: string,
): Promise<AppointmentWithRelations[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_LIST_SELECT)
    .eq("patient_id", patientId)
    .order("starts_at", { ascending: false });
  return unwrapSupabaseList(data, error) as AppointmentWithRelations[];
}
