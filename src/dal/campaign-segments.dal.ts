import type { CampaignSegmentFilters } from "@/lib/schemas/campaign-segment-schema";
import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { CampaignSegment } from "@/types/database.types";

export type CampaignSegmentPatient = {
  id: string;
  full_name: string;
  phone: string;
  visit_count: number;
  last_visit_at: string | null;
};

type CampaignSegmentRpcArgs = {
  p_clinic_id: string;
  p_treatment_id?: string;
  p_min_visits?: number;
  p_max_visits?: number;
  p_months_since_last_visit?: number;
  p_min_age?: number;
  p_max_age?: number;
};

/**
 * Los filtros sin valor se omiten en lugar de enviarse como null.
 *
 * El contador usa head: true, y ahí supabase-js serializa los argumentos como
 * query params: un null viajaría como la cadena "null" y PostgREST fallaría al
 * castearla ("invalid input syntax for type uuid"). La función SQL declara
 * DEFAULT NULL en todos los opcionales, así que omitirlos es equivalente.
 */
function toRpcArgs(
  clinicId: string,
  filters: CampaignSegmentFilters,
): CampaignSegmentRpcArgs {
  const args: CampaignSegmentRpcArgs = { p_clinic_id: clinicId };

  if (filters.treatmentId != null) {
    args.p_treatment_id = filters.treatmentId;
  }

  if (filters.minVisits != null) {
    args.p_min_visits = filters.minVisits;
  }

  if (filters.maxVisits != null) {
    args.p_max_visits = filters.maxVisits;
  }

  if (filters.monthsSinceLastVisit != null) {
    args.p_months_since_last_visit = filters.monthsSinceLastVisit;
  }

  if (filters.minAge != null) {
    args.p_min_age = filters.minAge;
  }

  if (filters.maxAge != null) {
    args.p_max_age = filters.maxAge;
  }

  return args;
}

export async function getCampaignSegmentPatients(
  clinicId: string,
  filters: CampaignSegmentFilters,
): Promise<CampaignSegmentPatient[]> {
  const { data, error } = await supabase.rpc(
    "campaign_segment_patients",
    toRpcArgs(clinicId, filters),
  );

  return unwrapSupabaseList(data, error) as CampaignSegmentPatient[];
}

/**
 * Tamaño del segmento para la vista previa. Usa head: true para que Postgres
 * cuente sin transferir las filas: el editor lo llama en cada cambio de filtro.
 */
export async function countCampaignSegmentPatients(
  clinicId: string,
  filters: CampaignSegmentFilters,
): Promise<number> {
  const { count, error } = await supabase.rpc(
    "campaign_segment_patients",
    toRpcArgs(clinicId, filters),
    { count: "exact", head: true },
  );

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export type CampaignSegmentInsert = Pick<
  CampaignSegment,
  "segment_type" | "config"
>;

export async function getCampaignSegments(
  campaignId: string,
): Promise<CampaignSegment[]> {
  const { data, error } = await supabase
    .from("campaign_segments")
    .select("*")
    .eq("campaign_id", campaignId)
    .order("created_at");

  return unwrapSupabaseList(data, error) as CampaignSegment[];
}

/**
 * Sustituye los segmentos de una campaña. Borra y vuelve a insertar en lugar de
 * hacer un diff: son pocas filas y así el resultado no depende del orden.
 */
export async function replaceCampaignSegments(
  campaignId: string,
  segments: CampaignSegmentInsert[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("campaign_segments")
    .delete()
    .eq("campaign_id", campaignId);

  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (segments.length === 0) {
    return;
  }

  const { error: insertError } = await supabase
    .from("campaign_segments")
    .insert(
      segments.map((segment) => ({ ...segment, campaign_id: campaignId })),
    );

  if (insertError) {
    throw new Error(insertError.message);
  }
}
