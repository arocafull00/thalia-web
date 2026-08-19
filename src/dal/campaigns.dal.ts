import {
  getCampaignSegments,
  replaceCampaignSegments,
} from "@/dal/campaign-segments.dal";
import { copyCampaignImage } from "@/lib/campaign-image-storage";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type { Campaign, CampaignStatus } from "@/types/database.types";

export type CampaignInsert = {
  clinic_id: string;
  title: string;
  content: string;
  footer_text: string | null;
  footer_website: string | null;
  footer_phone: string | null;
  image_url: string | null;
};

export type CampaignUpdate = Partial<Omit<CampaignInsert, "clinic_id">> & {
  status?: CampaignStatus;
  scheduled_at?: string | null;
};

/* Nota: no hay `getCampaigns` (lista completa). El listado es la única pantalla
 * que consumía las campañas de la clínica y ahora pide sólo su página; el
 * detalle usa `getCampaign`. */

export type CampaignPageParams = {
  clinicId: string | null;
  search: string;
  status: string;
  /** Límites ISO ya resueltos en la zona de la clínica; ver campaign-pagination. */
  createdFrom: string | null;
  createdTo: string | null;
  page: number;
  pageSize: number;
};

export type CampaignPageResult = {
  campaigns: Campaign[];
  total: number;
};

/**
 * Página del listado de campañas, filtrada y ordenada en servidor.
 *
 * Sin vista SQL: la búsqueda mira `title` y los filtros `status` y `created_at`,
 * las tres columnas de `campaigns`.
 */
export async function getCampaignsPage(
  params: CampaignPageParams,
): Promise<CampaignPageResult> {
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("campaigns")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    // Desempate estable: sin esto, dos campañas creadas en el mismo instante
    // pueden cambiar de orden entre páginas y una fila se repetiría o se
    // perdería. Duplicar una campaña deja dos con `created_at` muy próximos.
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

export async function getCampaign(campaignId: string): Promise<Campaign> {
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .single();

  return unwrapSupabase(data, error) as Campaign;
}

export async function insertCampaign(input: CampaignInsert): Promise<Campaign> {
  const { data, error } = await supabase
    .from("campaigns")
    .insert(input)
    .select("*")
    .single();

  return unwrapSupabase(data, error) as Campaign;
}

const MAX_TITLE_LENGTH = 120;

function buildCopyTitle(title: string, prefix: string): string {
  const candidate = `${prefix} ${title}`;

  if (candidate.length <= MAX_TITLE_LENGTH) {
    return candidate;
  }

  return `${candidate.slice(0, MAX_TITLE_LENGTH - 1).trimEnd()}…`;
}

/**
 * Clona una campaña en un borrador nuevo, con su mensaje, su imagen y sus
 * segmentos. Es la alternativa a reenviar: las protecciones antiduplicado de la
 * campaña original se quedan intactas y el envío nuevo parte de cero.
 */
export async function duplicateCampaign(
  campaignId: string,
  copyPrefix: string,
): Promise<Campaign> {
  const original = await getCampaign(campaignId);

  const imageKey = original.image_url
    ? await copyCampaignImage(original.image_url, original.clinic_id)
    : null;

  const duplicated = await insertCampaign({
    clinic_id: original.clinic_id,
    title: buildCopyTitle(original.title, copyPrefix),
    content: original.content,
    footer_text: original.footer_text,
    footer_website: original.footer_website,
    footer_phone: original.footer_phone,
    image_url: imageKey,
  });

  const segments = await getCampaignSegments(campaignId);

  if (segments.length > 0) {
    await replaceCampaignSegments(
      duplicated.id,
      segments.map((segment) => ({
        segment_type: segment.segment_type,
        config: segment.config,
      })),
    );
  }

  return duplicated;
}

export type SendCampaignResult = {
  sent: number;
  failed: number;
  skipped: number;
  total: number;
};

export async function sendCampaign(
  campaignId: string,
): Promise<SendCampaignResult> {
  const { data, error } = await supabase.functions.invoke("send-campaign", {
    body: { campaignId },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as SendCampaignResult;
}

export async function updateCampaign(
  campaignId: string,
  input: CampaignUpdate,
): Promise<Campaign> {
  const { data, error } = await supabase
    .from("campaigns")
    .update(input)
    .eq("id", campaignId)
    .select("*")
    .single();

  return unwrapSupabase(data, error) as Campaign;
}
