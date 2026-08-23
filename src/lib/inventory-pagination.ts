/**
 * Tamaño de página del listado de materiales.
 *
 * Vive en su propio módulo, y no en el hook, porque lo necesitan tanto el
 * cliente como el Server Component que siembra la primera página: importar el
 * hook desde el servidor arrastraría React al bundle de servidor.
 */
export const INVENTORY_PAGE_SIZE = 10;

/** Tamaño de página del historial de movimientos de un material (#75). */
export const INVENTORY_MOVEMENTS_PAGE_SIZE = 20;
