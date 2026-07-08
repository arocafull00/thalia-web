"use client";

import { useCallback, useState } from "react";

export function useFilterSearch(
  urlQuery: string,
  setFilter: (key: "q", value: string) => void,
) {
  const [searchQuery, setSearchQuery] = useState(urlQuery);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);

      if (value === urlQuery) {
        return;
      }

      setFilter("q", value);
    },
    [setFilter, urlQuery],
  );

  return { searchQuery, handleSearchChange };
}
