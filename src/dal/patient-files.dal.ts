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
  PatientFileWithPatient,
} from "@/types/database.types";

export type PatientFilesSort = "newest" | "oldest" | "name_asc" | "name_desc";

export type GlobalPatientFilesParams = {
  clinicId: string;
  patientSearch: string;
  category: PatientFileCategory | null;
  createdFrom: string | null;
  createdTo: string | null;
  sort: PatientFilesSort;
  page: number;
  pageSize: number;
};

export type PaginatedPatientFiles = {
  files: PatientFileWithPatient[];
  total: number;
};

type PatientFileRelation = NonNullable<PatientFileWithPatient["patients"]>;

type PatientFileWithRawPatient = PatientFile & {
  patients: PatientFileRelation | PatientFileRelation[] | null;
};

const GLOBAL_PATIENT_FILES_SELECT =
  "*, patients!inner(id, full_name, avatar_url)";

export async function getGlobalPatientFiles(
  params: GlobalPatientFilesParams,
): Promise<PaginatedPatientFiles> {
  const offset = (params.page - 1) * params.pageSize;
  const orderColumn =
    params.sort === "name_asc" || params.sort === "name_desc"
      ? "original_filename"
      : "created_at";
  const ascending = params.sort === "oldest" || params.sort === "name_asc";

  let query = supabase
    .from("patient_files")
    .select(GLOBAL_PATIENT_FILES_SELECT, { count: "exact" })
    .eq("clinic_id", params.clinicId);

  if (params.patientSearch.trim()) {
    query = query.ilike(
      "patients.full_name",
      `%${params.patientSearch.trim()}%`,
    );
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.createdFrom) {
    query = query.gte("created_at", params.createdFrom);
  }

  if (params.createdTo) {
    query = query.lte("created_at", params.createdTo);
  }

  const { data, error, count } = await query
    .order(orderColumn, { ascending })
    .range(offset, offset + params.pageSize - 1);
  const rows = unwrapSupabaseList(data, error) as PatientFileWithRawPatient[];

  return {
    files: rows.map((file) => ({
      ...file,
      patients: Array.isArray(file.patients)
        ? (file.patients[0] ?? null)
        : file.patients,
    })),
    total: count ?? 0,
  };
}

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
