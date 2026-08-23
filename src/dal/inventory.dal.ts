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

export type InventoryPageParams = {
  clinicId: string | null;
  search: string;
  category: string;
  /** Vacío es «sin filtrar»; los demás valores son la columna `stock_level`. */
  stockLevel: string;
  page: number;
  pageSize: number;
};

export type InventoryPageResult = {
  items: InventoryItem[];
  total: number;
};

export type InventoryStockSummary = {
  critical: number;
  low: number;
  optimal: number;
};

/**
 * Página del listado de materiales, filtrada y ordenada en servidor.
 *
 * El filtro de nivel de stock va contra `stock_level`, una columna generada:
 * la regla compara `stock` con `min_stock` y PostgREST no sabe comparar dos
 * columnas. Ver `20260823120000_inventory_stock_level.sql`.
 */
export async function getInventoryItemsPage(
  params: InventoryPageParams,
): Promise<InventoryPageResult> {
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("inventory_items")
    .select("*", { count: "exact" })
    .order("name")
    // Desempate estable: sin esto, dos materiales homónimos pueden cambiar de
    // orden entre páginas y una fila se repetiría o se perdería.
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

/**
 * Categorías de la clínica, para el desplegable de filtro.
 *
 * Consulta aparte: derivarlas de la página visible mostraría sólo las de esas
 * 10 filas y no se podría filtrar por el resto.
 */
export async function getInventoryCategories(
  clinicId: string | null,
): Promise<string[]> {
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

/**
 * Recuento de materiales por nivel de stock, para las tres tarjetas de
 * cabecera.
 *
 * Son tres `count` con `head: true`, que no traen ninguna fila. Calcularlo
 * sobre la página visible haría que las tarjetas contasen 10 materiales en vez
 * de todo el inventario.
 */
export async function getInventoryStockSummary(
  clinicId: string | null,
): Promise<InventoryStockSummary> {
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
