import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type { Transaction, TransactionType } from "@/types/database.types";

export type TransactionInsert = {
  clinic_id: string;
  appointment_id: string | null;
  type: TransactionType;
  category: string | null;
  amount: number;
  description: string | null;
  date: string;
  created_by: string;
};

export type TransactionUpdate = {
  type: TransactionType;
  category: string | null;
  amount: number;
  description: string | null;
  date: string;
};

export type TransactionPageParams = {
  clinicId: string | null;
  from: string;
  to: string;
  type: TransactionType | "all";
  category: string;
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
): Promise<Transaction[]> {
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

export async function insertTransaction(
  input: TransactionInsert,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .insert(input)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Transaction;
}

export async function updateTransaction(
  id: string,
  input: TransactionUpdate,
): Promise<Transaction> {
  const { data, error } = await supabase
    .from("transactions")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Transaction;
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
    .select("*", { count: "exact" })
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

/**
 * Categorías presentes en el mes, para el desplegable de filtro.
 *
 * Consulta aparte a propósito: derivarlas de la página visible mostraría sólo
 * las de esas 20 filas y no se podría filtrar por el resto.
 */
export async function getTransactionCategories(
  clinicId: string | null,
  from: string,
  to: string,
): Promise<string[]> {
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
