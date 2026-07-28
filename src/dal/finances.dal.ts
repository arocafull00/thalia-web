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
