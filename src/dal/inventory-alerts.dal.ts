import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { InventoryAlert } from "@/types/database.types";

export async function getInventoryAlerts(
  clinicId: string,
): Promise<InventoryAlert[]> {
  const { data, error } = await supabase
    .from("inventory_alerts")
    .select("*")
    .eq("clinic_id", clinicId)
    .is("resolved_at", null)
    .order("created_at", { ascending: false });
  return unwrapSupabaseList(data, error) as InventoryAlert[];
}
