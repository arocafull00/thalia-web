import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  InventoryItem,
  InventoryMovementType,
  InventoryMovementWithEmployee,
} from "@/types/database.types";

export type InventoryItemInsert = {
  clinic_id: string;
  name: string;
  category: string | null;
  unit: string | null;
  stock: number;
  min_stock: number;
  unit_price: number | null;
};

export type InventoryMovementInsert = {
  item_id: string;
  employee_id: string;
  type: InventoryMovementType;
  quantity: number;
  notes: string | null;
};

export async function getInventoryItems(
  clinicId: string | null,
): Promise<InventoryItem[]> {
  let query = supabase.from("inventory_items").select("*").order("name");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as InventoryItem[];
}

export async function getInventoryItem(itemId: string): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from("inventory_items")
    .select("*")
    .eq("id", itemId)
    .single();
  return unwrapSupabase(data, error) as InventoryItem;
}

export async function getInventoryMovements(
  itemId: string,
): Promise<InventoryMovementWithEmployee[]> {
  const { data, error } = await supabase
    .from("inventory_movements")
    .select("*, employees(id, full_name)")
    .eq("item_id", itemId)
    .order("created_at", { ascending: false });
  return unwrapSupabaseList(data, error) as InventoryMovementWithEmployee[];
}

export async function insertInventoryItem(
  input: InventoryItemInsert,
): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from("inventory_items")
    .insert(input)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as InventoryItem;
}

export async function updateInventoryItem(
  itemId: string,
  input: Omit<InventoryItemInsert, "clinic_id">,
): Promise<InventoryItem> {
  const { data, error } = await supabase
    .from("inventory_items")
    .update(input)
    .eq("id", itemId)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as InventoryItem;
}

export async function insertInventoryMovement(
  input: InventoryMovementInsert,
): Promise<void> {
  const { error } = await supabase
    .from("inventory_movements")
    .insert(input)
    .select("*")
    .single();
  if (error) {
    throw error;
  }
}
