/**
 * Tamaño de página del listado de movimientos.
 *
 * Vive en su propio módulo, y no en el hook, porque lo necesitan tanto el
 * cliente como el Server Component que siembra la primera página: importar el
 * hook desde el servidor arrastraría React al bundle de servidor.
 *
 * Son 20 y no 10 como el resto de listados: es el tamaño que ya usaba el
 * «cargar más» que sustituye, y cambiarlo alteraría la pantalla sin motivo.
 * La unificación de tamaños es un pendiente aparte de #36.
 */
export const TRANSACTIONS_PAGE_SIZE = 20;
