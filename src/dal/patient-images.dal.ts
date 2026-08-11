import {
  getSignedPatientImageUrl,
  removePatientImageObject,
} from "@/lib/patient-image-storage";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  PatientImage,
  PatientImageInsert,
  PatientImagePhase,
  PatientImageWithPatient,
} from "@/types/database.types";

export const PATIENT_IMAGES_PAGE_SIZE = 24;

export type PatientImagesSort = "recent" | "oldest";

export type PatientImagesFilters = {
  search: string;
  phase: PatientImagePhase | null;
  treatmentId: string | null;
  capturedFrom: string | null;
  capturedTo: string | null;
  sort: PatientImagesSort;
};

export type PatientImagesPageParams = PatientImagesFilters & {
  clinicId: string;
  patientId: string;
  offset: number;
  limit: number;
};

export type PaginatedPatientImages = {
  images: PatientImage[];
  total: number;
  hasMore: boolean;
};

export type TreatmentPatientImagesPage = {
  images: PatientImageWithPatient[];
  hasMore: boolean;
};

function escapePostgrestSearch(value: string) {
  return value.replace(/[\\"%_]/g, (character) => `\\${character}`);
}

export async function getPatientImagesPage(
  params: PatientImagesPageParams,
): Promise<PaginatedPatientImages> {
  const ascending = params.sort === "oldest";
  let query = supabase
    .from("patient_images")
    .select("*", { count: "exact" })
    .eq("clinic_id", params.clinicId)
    .eq("patient_id", params.patientId);

  const search = params.search.trim();

  if (search) {
    const pattern = `%${escapePostgrestSearch(search)}%`;
    query = query.or(
      `original_filename.ilike."${pattern}",notes.ilike."${pattern}"`,
    );
  }

  if (params.phase) {
    query = query.eq("phase", params.phase);
  }

  if (params.treatmentId) {
    query = query.eq("treatment_id", params.treatmentId);
  }

  if (params.capturedFrom) {
    query = query.gte("captured_at", params.capturedFrom);
  }

  if (params.capturedTo) {
    query = query.lte("captured_at", params.capturedTo);
  }

  const { data, error, count } = await query
    .order("captured_at", {
      ascending,
      nullsFirst: false,
    })
    .order("created_at", { ascending, nullsFirst: false })
    .order("id", { ascending })
    .range(params.offset, params.offset + params.limit - 1);

  const images = unwrapSupabaseList(data, error) as PatientImage[];
  const total = count ?? 0;

  return {
    images,
    total,
    hasMore: params.offset + images.length < total,
  };
}

export async function getTreatmentPatientImagesPage(
  clinicId: string,
  treatmentId: string,
  offset: number,
  limit: number,
): Promise<TreatmentPatientImagesPage> {
  const { data, error } = await supabase
    .from("patient_images")
    .select("*, patients(id, full_name)")
    .eq("clinic_id", clinicId)
    .eq("treatment_id", treatmentId)
    .order("captured_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false })
    .range(offset, offset + limit);

  const images = unwrapSupabaseList(data, error) as PatientImageWithPatient[];

  return {
    images: images.slice(0, limit),
    hasMore: images.length > limit,
  };
}

export async function getPatientImage(id: string): Promise<PatientImage> {
  const { data, error } = await supabase
    .from("patient_images")
    .select("*")
    .eq("id", id)
    .single();

  return unwrapSupabase(data, error) as PatientImage;
}

export async function createPatientImage(
  input: PatientImageInsert,
): Promise<PatientImage> {
  const { data, error } = await supabase
    .from("patient_images")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabase(data, error) as PatientImage;
}

export async function deletePatientImage(
  id: string,
  storageKey: string,
): Promise<void> {
  await removePatientImageObject(storageKey);

  const { error } = await supabase.from("patient_images").delete().eq("id", id);

  if (error) {
    throw error;
  }
}

export async function getImageUrl(
  image: PatientImage,
  expiresInSeconds = 3600,
): Promise<string> {
  return getSignedPatientImageUrl(image.storage_key, expiresInSeconds);
}
