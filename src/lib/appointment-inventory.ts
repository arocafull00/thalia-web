import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";

export type EffectiveAppointmentMaterial = {
  inventory_item_id: string;
  quantity: number;
  name: string;
  unit: string | null;
};

export async function fetchDefaultMaterialsForTreatments(
  treatmentIds: string[],
): Promise<EffectiveAppointmentMaterial[]> {
  if (treatmentIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("treatment_inventory_items")
    .select("inventory_item_id, quantity, inventory_items(id, name, unit)")
    .in("treatment_id", treatmentIds);

  const rows = unwrapSupabaseList(data, error) as {
    inventory_item_id: string;
    quantity: number;
    inventory_items: { id: string; name: string; unit: string | null } | null;
  }[];

  const aggregated = new Map<string, EffectiveAppointmentMaterial>();

  for (const row of rows) {
    const existing = aggregated.get(row.inventory_item_id);

    if (existing) {
      existing.quantity += row.quantity;
      continue;
    }

    aggregated.set(row.inventory_item_id, {
      inventory_item_id: row.inventory_item_id,
      quantity: row.quantity,
      name: row.inventory_items?.name ?? "Material",
      unit: row.inventory_items?.unit ?? null,
    });
  }

  return [...aggregated.values()];
}
