/**
 * Tamaño de página del listado de citas.
 *
 * Vive en su propio módulo, y no en el hook, porque lo necesitan tanto el
 * cliente como el Server Component que siembra la primera página: importar el
 * hook desde el servidor arrastraría React al bundle de servidor.
 */
export const APPOINTMENTS_PAGE_SIZE = 10;
