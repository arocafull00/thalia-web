import "server-only";

import { createClient } from "@/lib/supabase/server";
import { unwrapSupabase } from "@/lib/supabase-query";

export type ClinicMembershipRow = {
  id: string;
  clinic_id: string;
  role: string;
  status: string;
  clinics:
    | {
        id: string;
        name: string;
        logo_url: string | null;
        timezone: string | null;
      }
    | {
        id: string;
        name: string;
        logo_url: string | null;
        timezone: string | null;
      }[]
    | null;
};

export async function getMemberships(
  userId: string,
): Promise<ClinicMembershipRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinic_memberships")
    .select(
      "id, clinic_id, role, status, clinics(id, name, logo_url, timezone)",
    )
    .eq("user_id", userId)
    .eq("status", "active");

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as ClinicMembershipRow[];
}

export async function getClinicById(clinicId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinics")
    .select(
      "id, name, address, phone, specialty, logo_url, opening_time, closing_time, open_days, timezone",
    )
    .eq("id", clinicId)
    .single();

  return unwrapSupabase(data, error);
}
