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

export async function getClinicById(clinicId: string) {
  const { data, error } = await supabase
    .from("clinics")
    .select(
      "id, name, address, phone, specialty, logo_url, opening_time, closing_time, open_days, timezone",
    )
    .eq("id", clinicId)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateClinicHours(
  clinicId: string,
  values: {
    opening_time: string;
    closing_time: string;
    open_days: number[];
    timezone: string;
  },
) {
  const { data, error } = await supabase
    .from("clinics")
    .update(values)
    .eq("id", clinicId)
    .select("id, opening_time, closing_time, open_days, timezone")
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateClinic(
  clinicId: string,
  values: {
    name: string;
    phone: string | null;
    address: string | null;
    specialty: string | null;
  },
) {
  const { data, error } = await supabase
    .from("clinics")
    .update(values)
    .eq("id", clinicId)
    .select("id, name, address, phone, specialty, logo_url")
    .single();

  if (error) throw new Error(error.message);
  return data;
}
