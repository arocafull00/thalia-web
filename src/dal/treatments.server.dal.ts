import "server-only";

import { TREATMENT_DETAIL_SELECT } from "@/dal/selects";
import { createClient } from "@/lib/supabase/server";
import {
  unwrapSupabaseList,
  unwrapSupabaseNullable,
} from "@/lib/supabase-query";
import type { TreatmentWithInventory } from "@/types/database.types";

export async function getTreatments(
  clinicId: string | null,
): Promise<TreatmentWithInventory[]> {
  const supabase = await createClient();
  let query = supabase
    .from("treatment")
    .select("*, treatment_inventory_items(id)")
    .order("name");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as TreatmentWithInventory[];
}

export async function getTreatment(
  treatmentId: string,
): Promise<TreatmentWithInventory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("treatment")
    .select(TREATMENT_DETAIL_SELECT)
    .eq("id", treatmentId)
    .maybeSingle();
  return unwrapSupabaseNullable(data, error) as TreatmentWithInventory | null;
}
