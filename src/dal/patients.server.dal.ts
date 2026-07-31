import "server-only";

import { APPOINTMENT_LIST_SELECT } from "@/dal/selects";
import { createClient } from "@/lib/supabase/server";
import {
  unwrapSupabaseList,
  unwrapSupabaseNullable,
} from "@/lib/supabase-query";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

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
