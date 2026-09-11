import "server-only";

import type {
  GlobalPatientFilesParams,
  PaginatedPatientFiles,
} from "@/dal/patient-files.dal";
import { createClient } from "@/lib/supabase/server";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { PatientFile, PatientFileWithPatient } from "@/types/database.types";

type PatientFileRelation = NonNullable<PatientFileWithPatient["patients"]>;

type PatientFileWithRawPatient = PatientFile & {
  patients: PatientFileRelation | PatientFileRelation[] | null;
};

const GLOBAL_PATIENT_FILES_SELECT =
  "*, patients!inner(id, full_name, avatar_url)";

export async function getGlobalPatientFiles(
  params: GlobalPatientFilesParams,
): Promise<PaginatedPatientFiles> {
  const supabase = await createClient();
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
