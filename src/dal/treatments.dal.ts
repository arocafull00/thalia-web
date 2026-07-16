import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type { Treatment, TreatmentWithInventory } from "@/types/database.types";

const treatmentDetailSelect =
  "*, treatment_inventory_items(*, inventory_items(id, name, unit))";

export type TreatmentInventoryLinkInsert = {
  inventory_item_id: string;
  quantity: number;
};

export type TreatmentInsert = {
  clinic_id: string;
  name: string;
  category: string | null;
  duration_minutes: number;
  price: number | null;
  color: string | null;
};

export type TreatmentUpdate = Omit<TreatmentInsert, "clinic_id">;

export async function getTreatments(
  clinicId: string | null,
): Promise<TreatmentWithInventory[]> {
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
): Promise<TreatmentWithInventory> {
  const { data, error } = await supabase
    .from("treatment")
    .select(treatmentDetailSelect)
    .eq("id", treatmentId)
    .single();
  return unwrapSupabase(data, error) as TreatmentWithInventory;
}

export async function getTreatmentsByIds(
  treatmentIds: string[],
): Promise<Treatment[]> {
  if (treatmentIds.length === 0) {
    return [];
  }
  const { data, error } = await supabase
    .from("treatment")
    .select("*")
    .in("id", treatmentIds);
  return unwrapSupabaseList(data, error) as Treatment[];
}

export async function insertTreatment(
  input: TreatmentInsert,
): Promise<Treatment> {
  const { data, error } = await supabase
    .from("treatment")
    .insert(input)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Treatment;
}

export async function updateTreatment(
  treatmentId: string,
  input: TreatmentUpdate,
): Promise<Treatment> {
  const { data, error } = await supabase
    .from("treatment")
    .update(input)
    .eq("id", treatmentId)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Treatment;
}

export async function deleteTreatment(treatmentId: string): Promise<void> {
  const { error } = await supabase
    .from("treatment")
    .delete()
    .eq("id", treatmentId);

  if (error) {
    const message =
      error.code === "23503"
        ? "No se puede eliminar: el tratamiento tiene citas asociadas."
        : error.message;
    throw new Error(message);
  }
}

export async function replaceTreatmentInventoryLinks(
  treatmentId: string,
  links: TreatmentInventoryLinkInsert[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("treatment_inventory_items")
    .delete()
    .eq("treatment_id", treatmentId);

  if (deleteError) {
    throw deleteError;
  }

  if (links.length === 0) {
    return;
  }

  const rows = links.map((link) => ({
    treatment_id: treatmentId,
    inventory_item_id: link.inventory_item_id,
    quantity: link.quantity,
  }));

  const { error: insertError } = await supabase
    .from("treatment_inventory_items")
    .insert(rows);

  if (insertError) {
    throw insertError;
  }
}
