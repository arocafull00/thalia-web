/**
 * Tamaño de página del listado de tratamientos.
 *
 * Vive en su propio módulo, y no en el hook, porque lo necesitan tanto el
 * cliente como el Server Component que siembra la primera página: importar el
 * hook desde el servidor arrastraría React al bundle de servidor.
 */
export const TREATMENTS_PAGE_SIZE = 10;
