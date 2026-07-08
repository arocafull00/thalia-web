import { supabase } from "@/lib/supabase";
import { unwrapSupabaseList } from "@/lib/supabase-query";
import type { AppointmentWithRelations } from "@/types/database.types";

export async function getTodayAppointments(
  from: string,
  to: string,
  clinicId: string | null,
): Promise<AppointmentWithRelations[]> {
  let query = supabase
    .from("appointments")
    .select(
      "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_treatments(*, treatment(id, name, color, price))",
    )
    .gte("starts_at", from)
    .lte("starts_at", to)
    .order("starts_at");

  if (clinicId) {
    query = query.eq("clinic_id", clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as AppointmentWithRelations[];
}
