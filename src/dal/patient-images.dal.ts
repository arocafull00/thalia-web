import {
  getSignedPatientImageUrl,
  removePatientImageObject,
} from "@/lib/patient-image-storage";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  PatientImage,
  PatientImageInsert,
  PatientImageWithPatient,
} from "@/types/database.types";

export type TreatmentPatientImagesPage = {
  images: PatientImageWithPatient[];
  hasMore: boolean;
};

export async function getPatientImages(
  patientId: string,
): Promise<PatientImage[]> {
  const { data, error } = await supabase
    .from("patient_images")
    .select("*")
    .eq("patient_id", patientId)
    .order("captured_at", { ascending: false });

  return unwrapSupabaseList(data, error) as PatientImage[];
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
