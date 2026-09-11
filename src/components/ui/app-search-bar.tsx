"use client";

import { usePathname, useSearchParams } from "next/navigation";

import AppSearchBarInput from "@/components/ui/app-search-bar-input";
import { getSearchPlaceholder } from "@/copy/search-copy";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

export default function AppSearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const setQuery = useTopbarSearchStore((state) => state.setQuery);
  const clearQuery = useTopbarSearchStore((state) => state.clearQuery);
  const urlQuery = searchParams.get("q") ?? "";
  const placeholder = getSearchPlaceholder(pathname);

  if (!placeholder) {
    return null;
  }

  return (
    <AppSearchBarInput
      key={`${pathname}:${urlQuery}`}
      initialQuery={urlQuery}
      pathname={pathname}
      placeholder={placeholder}
      onClearQuery={clearQuery}
      onQueryChange={setQuery}
    />
  );
}
