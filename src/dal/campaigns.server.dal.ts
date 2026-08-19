import "server-only";

import type {
  CampaignPageParams,
  CampaignPageResult,
} from "@/dal/campaigns.dal";
import { createClient } from "@/lib/supabase/server";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { Campaign } from "@/types/database.types";

/**
 * Misma consulta que `getCampaignsPage` del DAL de navegador, con el cliente de
 * servidor, para sembrar la primera página desde el Server Component.
 *
 * Se duplica en lugar de compartirse porque cada uno usa un cliente distinto;
 * cualquier cambio en el filtrado hay que replicarlo en los dos.
 */
export async function getCampaignsPage(
  params: CampaignPageParams,
): Promise<CampaignPageResult> {
  const supabase = await createClient();
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("campaigns")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + params.pageSize - 1);

  if (params.clinicId) {
    query = query.eq("clinic_id", params.clinicId);
  }

  if (params.status) {
    query = query.eq("status", params.status);
  }

  if (params.createdFrom) {
    query = query.gte("created_at", params.createdFrom);
  }

  if (params.createdTo) {
    query = query.lte("created_at", params.createdTo);
  }

  const search = params.search.trim();

  if (search) {
    query = query.ilike("title", `%${search}%`);
  }

  const { data, error, count } = await query;

  return {
    campaigns: unwrapSupabaseList(data, error) as Campaign[],
    total: count ?? 0,
  };
}
