import "server-only";

import type {
  InventoryPageParams,
  InventoryPageResult,
  InventoryStockSummary,
} from "@/dal/inventory.dal";
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

/**
 * Mismas consultas que en el DAL de navegador, con el cliente de servidor,
 * para sembrar la primera carga desde el Server Component.
 *
 * Se duplican en lugar de compartirse: un helper genérico sobre el builder de
 * Supabase hace explotar la inferencia de TypeScript (TS2589). Cualquier
 * cambio en el filtrado hay que replicarlo en los dos.
 */
export async function getInventoryItemsPage(
  params: InventoryPageParams,
): Promise<InventoryPageResult> {
  const supabase = await createClient();
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("inventory_items")
    .select("*", { count: "exact" })
    .order("name")
    .order("id")
    .range(offset, offset + params.pageSize - 1);

  if (params.clinicId) {
    query = query.eq("clinic_id", params.clinicId);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.stockLevel) {
    query = query.eq("stock_level", params.stockLevel);
  }

  const search = params.search.trim();

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error, count } = await query;

  return {
    items: unwrapSupabaseList(data, error) as InventoryItem[],
    total: count ?? 0,
  };
}

export async function getInventoryCategories(
  clinicId: string | null,
): Promise<string[]> {
  const supabase = await createClient();
  let query = supabase.from("inventory_items").select("category");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  const rows = unwrapSupabaseList(data, error) as { category: string | null }[];

  return [
    ...new Set(rows.map((row) => row.category).filter(Boolean) as string[]),
  ].sort((left, right) => left.localeCompare(right, "es"));
}

export async function getInventoryStockSummary(
  clinicId: string | null,
): Promise<InventoryStockSummary> {
  const supabase = await createClient();
  const levels = ["critical", "low", "optimal"] as const;

  const counts = await Promise.all(
    levels.map(async (level) => {
      let query = supabase
        .from("inventory_items")
        .select("*", { count: "exact", head: true })
        .eq("stock_level", level);

      if (clinicId) {
        query = query.eq("clinic_id", clinicId);
      }

      const { count, error } = await query;

      if (error) {
        throw error;
      }

      return count ?? 0;
    }),
  );

  return { critical: counts[0], low: counts[1], optimal: counts[2] };
}
