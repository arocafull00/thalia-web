/**
 * Tamaño de página del listado de personal.
 *
 * Vive en su propio módulo, y no en el hook, porque lo necesitan tanto el
 * cliente como el Server Component que siembra la primera página: importar el
 * hook desde el servidor arrastraría React al bundle de servidor.
 */
export const EMPLOYEES_PAGE_SIZE = 10;

/** Valor del filtro de estado tal y como viaja en la URL. */
export type EmployeeStatusFilter = "" | "active" | "inactive";

/**
 * Traduce el filtro de la URL al booleano de `active`. `null` es «sin
 * filtrar», que no es lo mismo que `false`.
 */
export function parseEmployeeStatusFilter(value: string): boolean | null {
  if (value === "active") {
    return true;
  }

  if (value === "inactive") {
    return false;
  }

  return null;
}
