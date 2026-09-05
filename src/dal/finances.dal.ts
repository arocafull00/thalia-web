import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
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

function normalizeTransaction(row: TransactionQueryRow): Transaction {
  return {
    ...row,
    category: Array.isArray(row.category)
      ? (row.category[0] ?? null)
      : row.category,
  };
}

function normalizeTransactions(rows: unknown): Transaction[] {
  return (rows as TransactionQueryRow[]).map(normalizeTransaction);
}

export type TransactionInsert = {
  clinic_id: string;
  appointment_id: string | null;
  type: TransactionType;
  category_id: string | null;
  amount: number;
  description: string | null;
  date: string;
  created_by: string;
};

export type TransactionUpdate = {
  type: TransactionType;
  category_id: string | null;
  amount: number;
  description: string | null;
  date: string;
};

export type TransactionPageParams = {
  clinicId: string | null;
  from: string;
  to: string;
  type: TransactionType | "all";
  categoryId: string;
  search: string;
  page: number;
  pageSize: number;
};

export type TransactionPageResult = {
  transactions: Transaction[];
  total: number;
};

export async function getTransactions(
  from: string,
  to: string,
  type: TransactionType | "all",
  categoryId: string,
): Promise<Transaction[]> {
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

export async function insertTransaction(
  input: TransactionInsert,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert(input)
    .select(TRANSACTION_SELECT)
    .single();
  return normalizeTransaction(
    unwrapSupabase(data, error) as TransactionQueryRow,
  );
}

export async function updateTransaction(
  id: string,
  input: TransactionUpdate,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", id)
    .select(TRANSACTION_SELECT)
    .single();
  return normalizeTransaction(
    unwrapSupabase(data, error) as TransactionQueryRow,
  );
}

/**
 * Página del listado de movimientos, filtrada y ordenada en servidor.
 *
 * Sin vista SQL: la búsqueda mira `description` y `category`, y los filtros
 * `type`, `category` y el rango de `date`, todo columnas de `transactions`.
 */
export async function getTransactionsPage(
  params: TransactionPageParams,
): Promise<TransactionPageResult> {
  const offset = params.page * params.pageSize;

  let query = supabase
    .from("transactions")
    .select(TRANSACTION_SELECT, { count: "exact" })
    .gte("date", params.from)
    .lte("date", params.to)
    .order("date", { ascending: false })
    // Desempate estable: varios movimientos comparten fecha con frecuencia
    // —`date` es un día, no un instante— así que sin esto una fila se
    // repetiría entre páginas y otra desaparecería.
    .order("id", { ascending: false })
    .range(offset, offset + params.pageSize - 1);

  // Explícito aunque el RLS de `transactions` ya restringe a la clínica del
  // empleado: el `count: "exact"` debe contar lo mismo que se muestra, y no
  // depender de que la política no cambie.
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
