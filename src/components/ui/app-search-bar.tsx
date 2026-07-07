"use client";

import { usePathname, useSearchParams } from "next/navigation";

import AppSearchBarInput from "@/components/ui/app-search-bar-input";
import { getSearchPlaceholder } from "@/copy/search-copy";

export default function AppSearchBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
    />
  );
}
