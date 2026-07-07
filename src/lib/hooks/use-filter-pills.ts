import { useMemo } from "react";

import { SEARCH_COPY } from "@/copy/search-copy";

type CategorizedItem = {
  category: string | null;
};

export function useFilterPills(
  items: CategorizedItem[],
  allLabel = SEARCH_COPY.filters.all,
) {
  return useMemo(() => {
    const uniqueCategories = [
      ...new Set(items.map((item) => item.category).filter(Boolean)),
    ] as string[];

    return [
      allLabel,
      ...uniqueCategories.sort((left, right) =>
        left.localeCompare(right, "es"),
      ),
    ];
  }, [allLabel, items]);
}
