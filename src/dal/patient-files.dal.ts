import {
  getSignedPatientFileUrl,
  removePatientFileObject,
} from "@/lib/patient-file-storage";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  PatientFile,
  PatientFileCategory,
  PatientFileInsert,
  PatientFileUpdate,
} from "@/types/database.types";

export async function getPatientFiles(
  patientId: string,
  category?: PatientFileCategory,
): Promise<PatientFile[]> {
  let query = supabase
    .from("patient_files")
    .select("*")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  if (category) {
    query = query.eq("category", category);
  }

  const { data, error } = await query;

  return unwrapSupabaseList(data, error) as PatientFile[];
}

export async function getPatientFile(id: string): Promise<PatientFile> {
  const { data, error } = await supabase
    .from("patient_files")
    .select("*")
    .eq("id", id)
    .single();

  return unwrapSupabase(data, error) as PatientFile;
}

export async function createPatientFile(
  input: PatientFileInsert,
): Promise<PatientFile> {
  const { data, error } = await supabase
    .from("patient_files")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabase(data, error) as PatientFile;
}

export async function updatePatientFile(
  id: string,
  data: PatientFileUpdate,
): Promise<PatientFile> {
  const { data: updated, error } = await supabase
    .from("patient_files")
    .update(data)
    .eq("id", id)
    .select("*")
    .single();

  return unwrapSupabase(updated, error) as PatientFile;
}

export async function deletePatientFileRecord(id: string): Promise<void> {
  const { error } = await supabase.from("patient_files").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function deletePatientFile(
  id: string,
  storageKey: string,
): Promise<void> {
  await removePatientFileObject(storageKey);
  await deletePatientFileRecord(id);
}

export async function getFileUrl(
  file: PatientFile,
  expiresInSeconds = 3600,
): Promise<string> {
  return getSignedPatientFileUrl(file.storage_key, expiresInSeconds);
}
