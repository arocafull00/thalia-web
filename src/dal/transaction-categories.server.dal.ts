import "server-only";

import { createClient } from "@/lib/supabase/server";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  TransactionCategory,
  TransactionType,
} from "@/types/database.types";

export async function getTransactionCategories(
  clinicId: string | null,
): Promise<TransactionCategory[]> {
  const supabase = await createClient();
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

export async function insertTransactionCategory(input: {
  clinicId: string;
  name: string;
  type: TransactionType;
}): Promise<TransactionCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transaction_categories")
    .insert({
      clinic_id: input.clinicId,
      name: input.name,
      type: input.type,
    })
    .select("id, clinic_id, type, name, is_active, created_at, updated_at")
    .single();

  return unwrapSupabase(data, error) as TransactionCategory;
}

export async function renameTransactionCategory(input: {
  categoryId: string;
  clinicId: string;
  name: string;
}): Promise<TransactionCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transaction_categories")
    .update({ name: input.name })
    .eq("id", input.categoryId)
    .eq("clinic_id", input.clinicId)
    .select("id, clinic_id, type, name, is_active, created_at, updated_at")
    .single();

  return unwrapSupabase(data, error) as TransactionCategory;
}

export async function setTransactionCategoryActive(input: {
  categoryId: string;
  clinicId: string;
  isActive: boolean;
}): Promise<TransactionCategory> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("transaction_categories")
    .update({ is_active: input.isActive })
    .eq("id", input.categoryId)
    .eq("clinic_id", input.clinicId)
    .select("id, clinic_id, type, name, is_active, created_at, updated_at")
    .single();

  return unwrapSupabase(data, error) as TransactionCategory;
}
