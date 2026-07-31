import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { CampaignRecipientWithPatient } from "@/types/database.types";

export async function getCampaignRecipients(
  campaignId: string,
): Promise<CampaignRecipientWithPatient[]> {
  const { data, error } = await supabase
    .from("campaign_recipients")
    .select("*, patients(id, full_name)")
    .eq("campaign_id", campaignId)
    .order("created_at");

  return unwrapSupabaseList(data, error) as CampaignRecipientWithPatient[];
}

/**
 * Cuántos pacientes recibirían la campaña con los segmentos ya guardados.
 *
 * Se recalcula al abrir el detalle en lugar de fiarse del número que vio quien
 * la creó: entre el borrador y el envío pueden haber cambiado altas, bajas o
 * consentimientos, y el diálogo de confirmación debe decir la verdad de ahora.
 */
export async function countCampaignPatients(
  campaignId: string,
): Promise<number> {
  const { count, error } = await supabase.rpc(
    "campaign_patients_for_campaign",
    { p_campaign_id: campaignId },
    { count: "exact", head: true },
  );

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}
