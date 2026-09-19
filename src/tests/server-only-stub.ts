/*
 * `server-only` existe para que el empaquetador de Next falle si un módulo de
 * servidor acaba en el bundle del cliente. Bajo Vitest no hay tal frontera y el
 * paquete se resuelve a su versión de cliente, que lanza nada más importarla:
 * sin este sustituto, cualquier test que toque un módulo de servidor ni
 * siquiera llega a arrancar.
 */
export {};
