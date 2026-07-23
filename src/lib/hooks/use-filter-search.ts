"use client";

import { useCallback, useEffect, useState } from "react";

import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

const SEARCH_URL_DEBOUNCE_MS = 300;

export function useFilterSearch(
  urlQuery: string,
  setFilter: (key: "q", value: string) => void,
) {
  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [prevUrlQuery, setPrevUrlQuery] = useState(urlQuery);
  const debouncedQuery = useDebouncedValue(searchQuery, SEARCH_URL_DEBOUNCE_MS);

  if (urlQuery !== prevUrlQuery) {
    setPrevUrlQuery(urlQuery);
    setSearchQuery(urlQuery);
  }

  useEffect(() => {
    if (debouncedQuery === urlQuery) {
      return;
    }

    setFilter("q", debouncedQuery);
  }, [debouncedQuery, setFilter, urlQuery]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  return { searchQuery, handleSearchChange };
}
