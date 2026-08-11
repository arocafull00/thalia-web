/**
 * Tamaño de página del listado de pacientes.
 *
 * Vive en su propio módulo, y no en el hook, porque lo necesitan tanto el
 * cliente como el Server Component que siembra la primera página: importar el
 * hook desde el servidor arrastraría React al bundle de servidor.
 */
export const PATIENTS_PAGE_SIZE = 10;

/** Valor del filtro de comunicaciones comerciales tal y como viaja en la URL. */
export type PatientMarketingFilter = "" | "granted" | "denied";

/**
 * Traduce el filtro de la URL al booleano de `marketing_opt_in`. `null` es
 * «sin filtrar», que no es lo mismo que `false`.
 */
export function parseMarketingFilter(value: string): boolean | null {
  if (value === "granted") {
    return true;
  }

  if (value === "denied") {
    return false;
  }

  return null;
}
