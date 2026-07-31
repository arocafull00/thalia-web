import "server-only";

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
