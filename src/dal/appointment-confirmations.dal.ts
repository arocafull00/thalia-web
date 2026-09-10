import { supabase } from "@/lib/supabase";
import type { AppointmentConfirmationView } from "@/types/database.types";

/**
 * Confirmación de cita por el paciente (issue #87).
 *
 * El enlace viaja dentro del recordatorio de WhatsApp; el envío es cosa de la
 * edge function `send-reminders` y no pasa por aquí. Este DAL sólo sirve a la
 * página pública del enlace.
 *
 * Esa página no tiene sesión: el navegador va como `anon`. Por eso todo pasa
 * por dos funciones `SECURITY DEFINER` y no hay ni una consulta directa a
 * tablas — `anon` no tiene ninguna política que se lo permita.
 */

export async function getAppointmentConfirmation(
  token: string,
): Promise<AppointmentConfirmationView | null> {
  const { data, error } = await supabase.rpc("get_appointment_confirmation", {
    p_token: token,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Cero filas es lo que devuelve un token inexistente o ya borrado. No se
  // distingue de uno inválido a propósito: la página no debe revelar si el
  // enlace llegó a existir.
  return data?.[0] ?? null;
}

export async function confirmAppointmentByToken(
  token: string,
): Promise<AppointmentConfirmationView | null> {
  const { data, error } = await supabase.rpc("confirm_appointment_by_token", {
    p_token: token,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
}
