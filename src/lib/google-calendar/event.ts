import { siteUrl } from "@/lib/environment";

/*
 * Estados que SÍ viajan a Google. Lista blanca y no lista negra, a propósito:
 * si mañana alguien añade un estado nuevo, por defecto no sale del sistema en
 * lugar de colarse sin que nadie lo note. Para algo que cede datos a un tercero
 * ese es el fallo seguro.
 *
 * Fuera quedan, y cada uno por su motivo:
 *
 * - `pending_external`: la clínica se la ha propuesto al profesional y este
 *   todavía no la ha aceptado. Verla en su calendario le haría reservar un
 *   hueco al que no se ha comprometido.
 * - `rejected_external`: la ha rechazado.
 * - `cancelled` y `no_show`: el hueco queda libre.
 *
 * Un evento ya creado que pasa a cualquiera de estos estados se retira del
 * calendario, no se actualiza.
 */
const SYNCED_STATUSES = new Set([
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
]);

export function shouldSyncStatus(status: string): boolean {
  return SYNCED_STATUSES.has(status);
}

export type CalendarSyncPayload = {
  clinic_id: string;
  starts_at: string;
  ends_at: string;
  status: string;
};

export type GoogleEventBody = {
  summary: string;
  description: string;
  start: { dateTime: string };
  end: { dateTime: string };
  extendedProperties: { private: Record<string, string> };
};

/*
 * LA REGLA: a Google viaja el CUÁNDO, nunca el QUÉ.
 *
 * Meter el nombre del paciente o el tratamiento en un evento de Google sería
 * ceder datos de salud a un tercero: revela que esa persona es paciente de una
 * clínica estética, que es categoría especial del RGPD. Ni el título, ni la
 * descripción, ni las propiedades extendidas llevan nada clínico.
 *
 * El profesional llega al detalle real por el enlace, dentro de Thalia y con su
 * sesión. Google guarda una hora ocupada y un enlace, nada más.
 *
 * Hay un test que lo afirma. Si alguien "mejora" el título dentro de seis meses
 * añadiendo el nombre del paciente, ese test debe romperse.
 */
export function buildGoogleEvent(
  appointmentId: string,
  payload: CalendarSyncPayload,
  clinicName: string | null,
): GoogleEventBody {
  const base = siteUrl ?? "http://localhost:3000";
  const link = new URL(`/appointments/${appointmentId}`, base).toString();

  return {
    /*
     * El nombre de la clínica sí puede ir: es de la clínica, no del paciente, y
     * no dice nada de su salud. Además es lo único que distingue las citas de
     * un profesional que pasa consulta en varios sitios, porque todas caen en
     * el mismo calendario.
     */
    summary: clinicName ? `Cita · ${clinicName}` : "Cita",
    description: `Ver la cita en Thalia: ${link}\n\nGestionado desde Thalia. Los cambios hechos aquí no se sincronizan.`,
    start: { dateTime: payload.starts_at },
    end: { dateTime: payload.ends_at },
    /*
     * Sirve para reconciliar más adelante qué evento corresponde a qué cita sin
     * escribir nada legible. `private` significa que solo lo ve la aplicación
     * que lo escribió, no quien mire el calendario.
     */
    extendedProperties: { private: { thaliaAppointmentId: appointmentId } },
  };
}
