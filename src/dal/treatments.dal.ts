import { TREATMENT_DETAIL_SELECT } from "@/dal/selects";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type { Treatment, TreatmentWithInventory } from "@/types/database.types";

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

export type TreatmentPageParams = {
  clinicId: string | null;
  category: string;
  search: string;
  page: number;
  pageSize: number;
};

export type TreatmentPageResult = {
  treatments: TreatmentWithInventory[];
  total: number;
};

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

/**
 * Página del listado de tratamientos, filtrada y ordenada en servidor.
 *
 * Aquí no hace falta vista SQL, a diferencia de citas: la búsqueda mira sólo
 * `name` y el filtro `category`, ambas columnas de `treatment`.
 */
export async function getTreatmentsPage(
  params: TreatmentPageParams,
): Promise<TreatmentPageResult> {
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("treatment")
    .select("*, treatment_inventory_items(id)", { count: "exact" })
    .order("name")
    // Desempate estable: sin esto, dos tratamientos con el mismo nombre pueden
    // cambiar de orden entre páginas y una fila se repetiría o se perdería.
    .order("id")
    .range(offset, offset + params.pageSize - 1);

  if (params.clinicId) {
    query = query.eq("clinic_id", params.clinicId);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  const search = params.search.trim();

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data, error, count } = await query;

  return {
    treatments: unwrapSupabaseList(data, error) as TreatmentWithInventory[],
    total: count ?? 0,
  };
}

/**
 * Categorías existentes en la clínica, para el desplegable de filtro.
 *
 * Consulta aparte a propósito: derivarlas de la página visible mostraría sólo
 * las categorías de esas filas, y no se podría filtrar por el resto. Trae una
 * única columna de texto, así que recorrer toda la clínica es despreciable.
 */
export async function getTreatmentCategories(
  clinicId: string | null,
): Promise<string[]> {
  let query = supabase.from("treatment").select("category");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  const rows = unwrapSupabaseList(data, error) as { category: string | null }[];

  return [
    ...new Set(rows.map((row) => row.category).filter(Boolean) as string[]),
  ].sort((left, right) => left.localeCompare(right, "es"));
}

export async function getTreatment(
  treatmentId: string,
): Promise<TreatmentWithInventory> {
  const { data, error } = await supabase
    .from("treatment")
    .select(TREATMENT_DETAIL_SELECT)
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
