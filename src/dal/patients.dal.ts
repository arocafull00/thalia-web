import { APPOINTMENT_LIST_SELECT } from "@/dal/appointments.dal";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type { AppointmentWithRelations, Patient } from "@/types/database.types";

export type PatientInsert = {
  clinic_id: string;
  full_name: string;
  dni: string | null;
  birth_date: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
};

export type PatientUpdate = Partial<Omit<PatientInsert, "clinic_id">> & {
  avatar_url?: string;
};

export async function getPatients(
  clinicId: string | null,
  search: string,
): Promise<Patient[]> {
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

export async function getPatient(patientId: string): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .select("*")
    .eq("id", patientId)
    .single();
  return unwrapSupabase(data, error) as Patient;
}

export async function getPatientAppointments(
  patientId: string,
): Promise<AppointmentWithRelations[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_LIST_SELECT)
    .eq("patient_id", patientId)
    .order("starts_at", { ascending: false });
  return unwrapSupabaseList(data, error) as AppointmentWithRelations[];
}

export async function getUpcomingPatientAppointments(
  patientId: string,
): Promise<AppointmentWithRelations[]> {
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_LIST_SELECT)
    .eq("patient_id", patientId)
    .gt("starts_at", new Date().toISOString())
    .order("starts_at");
  return unwrapSupabaseList(data, error) as AppointmentWithRelations[];
}

export async function insertPatient(input: PatientInsert): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .insert(input)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Patient;
}

export async function updatePatient(
  id: string,
  values: PatientUpdate,
): Promise<Patient> {
  const { data, error } = await supabase
    .from("patients")
    .update(values)
    .eq("id", id)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Patient;
}
