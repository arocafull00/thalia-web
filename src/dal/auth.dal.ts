import { supabase } from "@/lib/supabase";
import { unwrapSupabase } from "@/lib/supabase-query";
import type { Employee } from "@/types/database.types";

export type ProfileUpdate = {
  full_name: string;
  phone: string | null;
  specialty: string | null;
  color: string | null;
};

export async function getEmployeeProfile(
  userId: string,
): Promise<Employee | null> {
  const { data, error } = await supabase
    .from("employees")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updateEmployeeProfile(
  userId: string,
  values: ProfileUpdate,
): Promise<Employee> {
  const { data, error } = await supabase
    .from("employees")
    .update(values)
    .eq("id", userId)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Employee;
}

export async function updateEmployeeAvatar(
  userId: string,
  avatarUrl: string,
): Promise<Employee> {
  const { data, error } = await supabase
    .from("employees")
    .update({ avatar_url: avatarUrl })
    .eq("id", userId)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Employee;
}
