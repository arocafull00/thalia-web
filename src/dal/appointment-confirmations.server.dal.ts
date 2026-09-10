import { createClient } from "@/lib/supabase/server";
import type { AppointmentConfirmationView } from "@/types/database.types";

/**
 * Lectura del estado de la cita desde el Server Component de /cita/[token].
 *
 * Es de sólo lectura a propósito: abrir la página no confirma nada. WhatsApp y
 * Twilio precargan los enlaces para generar la vista previa del mensaje, así
 * que si la confirmación ocurriera aquí las citas se confirmarían solas en
 * cuanto se entregase el mensaje.
 */
export async function getAppointmentConfirmationServer(
  token: string,
): Promise<AppointmentConfirmationView | null> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_appointment_confirmation", {
    p_token: token,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0] ?? null;
}
