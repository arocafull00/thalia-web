import "server-only";

import { createClient } from "@/lib/supabase/server";
import {
  unwrapSupabaseList,
  unwrapSupabaseNullable,
} from "@/lib/supabase-query";
import type {
  InventoryItem,
  InventoryMovementWithEmployee,
} from "@/types/database.types";

export async function getInventoryItems(
  clinicId: string | null,
): Promise<InventoryItem[]> {
  const supabase = await createClient();
  let query = supabase.from("inventory_items").select("*").order("name");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as InventoryItem[];
}

export async function getInventoryItem(
  itemId: string,
): Promise<InventoryItem | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("id", itemId)
    .maybeSingle();
  return unwrapSupabaseNullable(data, error);
}

export async function getInventoryMovements(
  itemId: string,
): Promise<InventoryMovementWithEmployee[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("inventory_movements")
    .select("*, employees(id, full_name)")
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });
  return unwrapSupabaseList(data, error) as InventoryMovementWithEmployee[];
}
