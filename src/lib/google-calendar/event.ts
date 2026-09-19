import { siteUrl } from "@/lib/environment";

/*
 * Estados en los que la cita deja de ocupar hueco en la agenda. El evento se
 * retira del calendario en lugar de actualizarse: mantener una cita cancelada
 * ahí llevaría al profesional a reservar mal su tiempo.
 */
const RELEASED_STATUSES = new Set(["cancelled", "no_show"]);

export function isReleasedStatus(status: string): boolean {
  return RELEASED_STATUSES.has(status);
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
): GoogleEventBody {
  const base = siteUrl ?? "http://localhost:3000";
  const link = new URL(`/appointments/${appointmentId}`, base).toString();

  return {
    summary: "Cita",
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
