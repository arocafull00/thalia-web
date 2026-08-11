import {
  APPOINTMENT_DETAIL_SELECT,
  APPOINTMENT_LIST_SELECT,
} from "@/dal/selects";
import { supabase } from "@/lib/supabase";
import { unwrapSupabase, unwrapSupabaseList } from "@/lib/supabase-query";
import type {
  Appointment,
  AppointmentInventoryItemWithInventory,
  AppointmentStatus,
  AppointmentWithRelations,
} from "@/types/database.types";

export { APPOINTMENT_LIST_SELECT } from "@/dal/selects";

export type EffectiveAppointmentMaterial = {
  inventory_item_id: string;
  quantity: number;
  name: string;
  unit: string | null;
};

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

export type AppointmentPageParams = AppointmentRangeParams & {
  status: AppointmentStatus | null;
  search: string;
  page: number;
  pageSize: number;
};

export type AppointmentPageResult = {
  appointments: AppointmentWithRelations[];
  total: number;
};

/**
 * Página del listado de citas, filtrada y ordenada en servidor.
 *
 * Son dos consultas a propósito. La vista `appointments_search` resuelve qué
 * citas cumplen los filtros —incluida la búsqueda, que cruza tres tablas— y en
 * qué orden, devolviendo sólo ids y el total. El payload completo se lee
 * después de `appointments` con su select anidado, porque una vista no tiene
 * claves foráneas y PostgREST no puede embeber relaciones desde ella.
 *
 * La segunda consulta trae como mucho `pageSize` filas, así que el coste del
 * viaje extra es pequeño frente a traerse el listado entero como hasta ahora.
 */
export async function getAppointmentsPage(
  params: AppointmentPageParams,
): Promise<AppointmentPageResult> {
  const offset = params.page * params.pageSize;

  let idsQuery = supabase
    .from("appointments_search")
    .select("id", { count: "exact" })
    .gte("starts_at", params.startIso)
    .lte("starts_at", params.endIso)
    // Descendente: en un listado de citas interesa lo más reciente arriba.
    .order("starts_at", { ascending: false })
    // Desempate estable: sin esto, dos citas a la misma hora pueden cambiar de
    // orden entre páginas y una fila se repetiría o se perdería.
    .order("id", { ascending: false })
    .range(offset, offset + params.pageSize - 1);

  if (params.employeeId) {
    idsQuery = idsQuery.eq("employee_id", params.employeeId);
  }

  if (params.clinicId) {
    idsQuery = idsQuery.eq("clinic_id", params.clinicId);
  }

  if (params.status) {
    idsQuery = idsQuery.eq("status", params.status);
  }

  const search = params.search.trim().toLowerCase();

  if (search) {
    idsQuery = idsQuery.ilike("search_text", `%${search}%`);
  }

  const { data: idRows, error: idsError, count } = await idsQuery;
  const ids = (unwrapSupabaseList(idRows, idsError) as { id: string }[]).map(
    (row) => row.id,
  );

  if (ids.length === 0) {
    return { appointments: [], total: count ?? 0 };
  }

  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_LIST_SELECT)
    .in("id", ids);

  const rows = unwrapSupabaseList(data, error) as AppointmentWithRelations[];

  // `in` no conserva el orden de la lista, así que se reordena según los ids
  // que devolvió la vista, que son los que llevan el orden bueno.
  const position = new Map(ids.map((id, index) => [id, index]));
  const appointments = rows.toSorted(
    (left, right) =>
      (position.get(left.id) ?? 0) - (position.get(right.id) ?? 0),
  );

  return { appointments, total: count ?? 0 };
}

export async function getAppointment(
  appointmentId: string,
): Promise<AppointmentWithRelations> {
  const { data, error } = await supabase
    .from("appointments")
    .select(APPOINTMENT_DETAIL_SELECT)
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

export type FutureAppointmentConflict = {
  id: string;
  starts_at: string;
  patients: { full_name: string } | { full_name: string }[] | null;
  employees: { full_name: string } | { full_name: string }[] | null;
};

export async function getFutureAppointments(
  clinicId: string,
): Promise<FutureAppointmentConflict[]> {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("appointments")
    .select("id, starts_at, patients(full_name), employees(full_name)")
    .eq("clinic_id", clinicId)
    .in("status", ["scheduled", "confirmed"])
    .gt("starts_at", now)
    .order("starts_at");
  return unwrapSupabaseList(data, error) as FutureAppointmentConflict[];
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
