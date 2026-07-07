"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

export function useUrlFilters<T extends Record<string, string>>(defaults: T) {
  const router = useRouter();
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

  const setFilter = useCallback(
    (key: keyof T, value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      if (!value || value === defaults[key]) {
        params.delete(String(key));
      } else {
        params.set(String(key), value);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [defaults, pathname, router, searchParams],
  );

  const setFilters = useCallback(
    (updates: Partial<T>) => {
      const params = new URLSearchParams(searchParams.toString());

      for (const [key, value] of Object.entries(updates)) {
        if (!value || value === defaults[key as keyof T]) {
          params.delete(key);
          continue;
        }

        params.set(key, value);
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    },
    [defaults, pathname, router, searchParams],
  );

  return { filters, setFilter, setFilters };
}
