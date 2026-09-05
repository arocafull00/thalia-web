import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { TransactionCategory } from "@/types/database.types";

export async function getTransactionCategories(
  clinicId: string | null,
): Promise<TransactionCategory[]> {
  let query = supabase
    .from("transaction_categories")
    .select("id, clinic_id, type, name, is_active, created_at, updated_at")
    .order("type")
    .order("name");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as TransactionCategory[];
}
