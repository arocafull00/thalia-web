import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

const SEARCH_DEBOUNCE_MS = 300;

export function useSearch(externalSearch?: string) {
  const topbarQuery = useTopbarSearchStore((state) => state.query);
  const search = externalSearch !== undefined ? externalSearch : topbarQuery;

  return useDebouncedValue(search, SEARCH_DEBOUNCE_MS);
}
