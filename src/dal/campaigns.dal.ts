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

export async function getCampaigns(
  clinicId: string | null,
): Promise<Campaign[]> {
  let query = supabase
    .from("campaigns")
    .select("*")
    .order("created_at", { ascending: false });

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as Campaign[];
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
