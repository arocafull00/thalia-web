/**
 * Fecha y hora de la cita en la zona horaria de la clínica, no en la del móvil
 * del paciente. Un paciente de vacaciones fuera de España vería otra hora si se
 * formatease en local, y la cita es donde está la clínica.
 */
export function formatConfirmationDate(
  startsAtIso: string,
  timezone: string,
): string {
  return new Date(startsAtIso).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: timezone,
  });
}

export function formatConfirmationTime(
  startsAtIso: string,
  timezone: string,
): string {
  return new Date(startsAtIso).toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
}
