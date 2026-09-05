import "server-only";

import type {
  TransactionPageParams,
  TransactionPageResult,
} from "@/dal/finances.dal";
import { createClient } from "@/lib/supabase/server";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  Transaction,
  TransactionCategorySummary,
  TransactionRow,
  TransactionType,
} from "@/types/database.types";

const TRANSACTION_SELECT =
  "id, clinic_id, appointment_id, type, category_id, amount, description, date, created_by, created_at, updated_at, category:transaction_categories!transactions_category_id_clinic_id_type_fkey(id, type, name, is_active)";

type TransactionQueryRow = TransactionRow & {
  category: TransactionCategorySummary | TransactionCategorySummary[] | null;
};

function normalizeTransactions(rows: unknown): Transaction[] {
  return (rows as TransactionQueryRow[]).map((row) => ({
    ...row,
    category: Array.isArray(row.category)
      ? (row.category[0] ?? null)
      : row.category,
  }));
}

export async function getTransactions(
  from: string,
  to: string,
  type: TransactionType | "all",
  categoryId: string,
): Promise<Transaction[]> {
  const supabase = await createClient();
  let query = supabase
    .from("transactions")
    .select(TRANSACTION_SELECT)
    .gte("date", from)
    .lte("date", to)
    .order("date", { ascending: false });

  if (type !== "all") {
    query = query.eq("type", type);
  }

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;
  return normalizeTransactions(unwrapSupabaseList(data, error));
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
    .select(TRANSACTION_SELECT, { count: "exact" })
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

  if (params.categoryId) {
    query = query.eq("category_id", params.categoryId);
  }

  const search = params.search.trim();

  if (search) {
    query = query.ilike("description", `%${search}%`);
  }

  const { data, error, count } = await query;

  return {
    transactions: normalizeTransactions(unwrapSupabaseList(data, error)),
    total: count ?? 0,
  };
}
