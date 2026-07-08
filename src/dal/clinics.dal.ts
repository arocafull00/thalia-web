import { supabase } from "@/lib/supabase";

export type ClinicMembershipRow = {
  id: string;
  clinic_id: string;
  role: string;
  status: string;
  clinics:
    | { id: string; name: string; logo_url: string | null }
    | { id: string; name: string; logo_url: string | null }[]
    | null;
};

export async function getMemberships(
  userId: string,
): Promise<ClinicMembershipRow[]> {
  const { data, error } = await supabase
    .from("clinic_memberships")
    .select("id, clinic_id, role, status, clinics(id, name, logo_url)")
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClinicMembershipRow[];
}
