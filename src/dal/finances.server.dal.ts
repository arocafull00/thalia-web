import "server-only";

import type {
  TransactionPageParams,
  TransactionPageResult,
} from "@/dal/finances.dal";
import { createClient } from "@/lib/supabase/server";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { Transaction, TransactionType } from "@/types/database.types";

export async function getTransactions(
  from: string,
  to: string,
  type: TransactionType | "all",
): Promise<Transaction[]> {
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("*")
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false });

  if (type !== "all") {
    query = query.eq("type", type);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as Transaction[];
}

/**
 * Mismas consultas que en el DAL de navegador, con el cliente de servidor,
 * para sembrar la primera página desde el Server Component.
 *
 * Se duplican en lugar de compartirse: un helper genérico sobre el builder de
 * Supabase hace explotar la inferencia de TypeScript (TS2589). Cualquier
 * cambio en el filtrado hay que replicarlo en los dos.
 */
export async function getTransactionsPage(
  params: TransactionPageParams,
): Promise<TransactionPageResult> {
  const supabase = await createClient();
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("transactions")
    .select("*", { count: "exact" })
    .gte("date", params.from)
    .lte("date", params.to)
    .order("date", { ascending: false })
    .order("id", { ascending: false })
    .range(offset, offset + params.pageSize - 1);

  if (params.clinicId) {
    query = query.eq("clinic_id", params.clinicId);
  }

  if (params.type !== "all") {
    query = query.eq("type", params.type);
  }

  if (params.category) {
    query = query.eq("category", params.category);
  }

  const search = params.search.trim();

  if (search) {
    query = query.or(
      `description.ilike.%${search}%,category.ilike.%${search}%`,
    );
  }

  const { data, error, count } = await query;

  return {
    transactions: unwrapSupabaseList(data, error) as Transaction[],
    total: count ?? 0,
  };
}

export async function getTransactionCategories(
  clinicId: string | null,
  from: string,
  to: string,
): Promise<string[]> {
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select("category")
    .gte("date", from)
    .lte("date", to);

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  const rows = unwrapSupabaseList(data, error) as { category: string | null }[];

  return [
    ...new Set(rows.map((row) => row.category).filter(Boolean) as string[]),
  ].sort((left, right) => left.localeCompare(right, "es"));
}
