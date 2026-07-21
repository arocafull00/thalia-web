import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  Appointment,
  AppointmentInventoryItemWithInventory,
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

export type EffectiveAppointmentMaterial = {
  inventory_item_id: string;
  quantity: number;
  name: string;
  unit: string | null;
};

export const APPOINTMENT_LIST_SELECT =
  "*, patients(id, full_name, phone), employees(id, full_name, color), appointment_inventory_items(*, inventory_items(id, name, unit, stock)), appointment_treatments(*, treatment(id, name, color, price, duration_minutes, treatment_inventory_items(*, inventory_items(id, name, unit, stock))))";

const appointmentDetailSelect =
  "*, patients(id, full_name, phone, avatar_url), employees(id, full_name, color, specialty, role, avatar_url), appointment_treatments(*, treatment(id, name, color, price, duration_minutes))";

const appointmentInventorySelect = "*, inventory_items(id, name, unit)";

export type AppointmentRangeParams = {
  startIso: string;
  endIso: string;
  clinicId: string | null;
  employeeId: string | null;
};

export type AppointmentInsert = {
  clinic_id: string;
  patient_id: string;
  employee_id: string;
  starts_at: string;
  ends_at: string;
  notes: string | null;
  status: AppointmentStatus;
};

export type AppointmentUpdate = {
  patient_id: string;
  employee_id: string;
  starts_at: string;
  ends_at: string;
  notes: string | null;
};

export type AppointmentTreatmentInsert = {
  appointment_id: string;
  treatment_id: string;
  price_at_booking: number;
};

export type AppointmentInventoryLinkInput = {
  inventory_item_id: string;
  quantity: number;
};

export async function getAppointments(
  params: AppointmentRangeParams,
): Promise<AppointmentWithRelations[]> {
  let query = supabase
    .from("appointments")
    .select(APPOINTMENT_LIST_SELECT)
    .gte("starts_at", params.startIso)
    .lte("starts_at", params.endIso)
    .order("starts_at");

  if (params.employeeId) {
    query = query.eq("employee_id", params.employeeId);
  }

  if (params.clinicId) {
    query = query.eq("clinic_id", params.clinicId);
  }

  const { data, error } = await query;
  return unwrapSupabaseList(data, error) as AppointmentWithRelations[];
}

export async function getAppointment(
  appointmentId: string,
): Promise<AppointmentWithRelations> {
  const { data, error } = await supabase
    .from("appointments")
    .select(appointmentDetailSelect)
    .eq("id", appointmentId)
    .single();
  return unwrapSupabase(data, error) as AppointmentWithRelations;
}

export async function getAppointmentInventoryItems(
  appointmentId: string,
): Promise<AppointmentInventoryItemWithInventory[]> {
  const { data, error } = await supabase
    .from("appointment_inventory_items")
    .select(appointmentInventorySelect)
    .eq("appointment_id", appointmentId);
  return unwrapSupabaseList(
    data,
    error,
  ) as AppointmentInventoryItemWithInventory[];
}

export async function getDefaultMaterials(
  treatmentIds: string[],
): Promise<EffectiveAppointmentMaterial[]> {
  if (treatmentIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("treatment_inventory_items")
    .select("inventory_item_id, quantity, inventory_items(id, name, unit)")
    .in("treatment_id", treatmentIds);

  const rows = unwrapSupabaseList(data, error);
  const aggregated = new Map<string, EffectiveAppointmentMaterial>();

  for (const row of rows) {
    const inventoryItem = Array.isArray(row.inventory_items)
      ? (row.inventory_items[0] ?? null)
      : row.inventory_items;
    const existing = aggregated.get(row.inventory_item_id);

    if (existing) {
      existing.quantity += row.quantity;
      continue;
    }

    aggregated.set(row.inventory_item_id, {
      inventory_item_id: row.inventory_item_id,
      quantity: row.quantity,
      name: inventoryItem?.name ?? "Material",
      unit: inventoryItem?.unit ?? null,
    });
  }

  return [...aggregated.values()];
}

export async function insertAppointment(
  input: AppointmentInsert,
): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .insert(input)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Appointment;
}

export async function insertAppointmentTreatments(
  rows: AppointmentTreatmentInsert[],
): Promise<void> {
  const { error } = await supabase.from("appointment_treatments").insert(rows);
  if (error) throw error;
}

export async function updateAppointment(
  id: string,
  input: AppointmentUpdate,
): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Appointment;
}

export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus,
): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Appointment;
}

export async function deleteAppointmentTreatments(
  appointmentId: string,
): Promise<void> {
  const { error } = await supabase
    .from("appointment_treatments")
    .delete()
    .eq("appointment_id", appointmentId);
  if (error) throw error;
}

export async function deleteAppointment(
  appointmentId: string,
  restoreStock: boolean,
): Promise<void> {
  const { error } = await supabase.rpc("delete_appointment", {
    p_appointment_id: appointmentId,
    p_restore_stock: restoreStock,
  });

  if (error) throw error;
}

export async function rescheduleAppointment(
  id: string,
  startsAt: string,
  endsAt: string,
): Promise<Appointment> {
  const { data, error } = await supabase
    .from("appointments")
    .update({ starts_at: startsAt, ends_at: endsAt })
    .eq("id", id)
    .select("*")
    .single();
  return unwrapSupabase(data, error) as Appointment;
}

export async function replaceAppointmentInventoryItems(
  appointmentId: string,
  items: AppointmentInventoryLinkInput[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("appointment_inventory_items")
    .delete()
    .eq("appointment_id", appointmentId);

  if (deleteError) throw deleteError;
  if (items.length === 0) return;

  const rows = items.map((item) => ({
    appointment_id: appointmentId,
    inventory_item_id: item.inventory_item_id,
    quantity: item.quantity,
  }));

  const { error: insertError } = await supabase
    .from("appointment_inventory_items")
    .insert(rows);

  if (insertError) throw insertError;
}
