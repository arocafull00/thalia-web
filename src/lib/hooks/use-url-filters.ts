"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

/**
 * Filtros de listado sincronizados con la query string.
 *
 * Escribe la URL con `history.replaceState` y no con `router.replace`. Este
 * último es una navegación: Next vuelve a pedir el árbol RSC y re-ejecuta el
 * Server Component de la pantalla, que en los listados paginados significa
 * repetir la consulta a la base de datos en cada tecleo o cambio de página.
 * Desde Next 14.1 el framework integra `pushState`/`replaceState` en su router,
 * así que `useSearchParams` se sincroniza igual pero sin tocar el servidor.
 *
 * Consecuencia buscada: el Server Component siembra la primera carga y los
 * refrescos (F5), y a partir de ahí manda el cliente con su caché.
 */
export function useUrlFilters<T extends Record<string, string>>(defaults: T) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const defaultKeys = useMemo(
    () => Object.keys(defaults) as (keyof T)[],
    [defaults],
  );

  const filters = useMemo(() => {
    const result = { ...defaults };

    for (const key of defaultKeys) {
      const value = searchParams.get(String(key));
      if (value !== null) {
        result[key] = value as T[keyof T];
      }
    }

    return result;
  }, [defaultKeys, defaults, searchParams]);

  const applyParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      // Se parte de la URL viva, no de `searchParams`: ese es el valor del
      // render, y dos cambios en el mismo tick harían que el segundo arrancase
      // de un estado ya obsoleto y borrase al primero. Pasaba al limpiar la
      // búsqueda mientras se cambiaba otro filtro.
      const params = new URLSearchParams(window.location.search);
      mutate(params);

      const query = params.toString();
      const nextUrl = query ? `${pathname}?${query}` : pathname;
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (nextUrl === currentUrl) {
        return;
      }

      window.history.replaceState(null, "", nextUrl);
    },
    [pathname],
  );

  const setFilter = useCallback(
    (key: keyof T, value: string) => {
      applyParams((params) => {
        if (!value || value === defaults[key]) {
          params.delete(String(key));
          return;
        }

        params.set(String(key), value);
      });
    },
    [applyParams, defaults],
  );

  const setFilters = useCallback(
    (updates: Partial<T>) => {
      applyParams((params) => {
        for (const [key, value] of Object.entries(updates)) {
          if (!value || value === defaults[key as keyof T]) {
            params.delete(key);
            continue;
          }

          params.set(key, value);
        }
      });
    },
    [applyParams, defaults],
  );

  return { filters, setFilter, setFilters };
}
