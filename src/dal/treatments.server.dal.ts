import "server-only";

import { TREATMENT_DETAIL_SELECT } from "@/dal/selects";
import type {
  TreatmentPageParams,
  TreatmentPageResult,
} from "@/dal/treatments.dal";
import { createClient } from "@/lib/supabase/server";
import {
  unwrapSupabaseList,
  unwrapSupabaseNullable,
} from "@/lib/supabase-query";
import type { TreatmentWithInventory } from "@/types/database.types";

/**
 * Misma consulta que `getTreatmentsPage` del DAL de navegador, con el cliente
 * de servidor, para sembrar la primera página desde el Server Component.
 *
 * Se duplica en lugar de compartirse porque cada uno usa un cliente distinto;
 * cualquier cambio en el filtrado hay que replicarlo en los dos.
 */
export async function getTreatmentsPage(
  params: TreatmentPageParams,
): Promise<TreatmentPageResult> {
  const supabase = await createClient();
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("treatment")
    .select("*, treatment_inventory_items(id)", { count: "exact" })
    .order("name")
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

export async function getTreatmentCategories(
  clinicId: string | null,
): Promise<string[]> {
  const supabase = await createClient();
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
