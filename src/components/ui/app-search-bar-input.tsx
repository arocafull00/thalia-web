"use client";

import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

const SEARCH_DEBOUNCE_MS = 300;

type AppSearchBarInputProps = {
  initialQuery: string;
  pathname: string;
  placeholder: string;
};

export default function AppSearchBarInput({
  initialQuery,
  pathname,
  placeholder,
}: AppSearchBarInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setQuery = useTopbarSearchStore((state) => state.setQuery);
  const clearQuery = useTopbarSearchStore((state) => state.clearQuery);
  const [inputValue, setInputValue] = useState(initialQuery);
  const debouncedValue = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);
  const skipNextUrlWrite = useRef(initialQuery !== "");

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery, setQuery]);

  useEffect(() => {
    const urlQuery = searchParams.get("q") ?? "";

    if (skipNextUrlWrite.current) {
      if (debouncedValue === urlQuery) {
        skipNextUrlWrite.current = false;
      }

      return;
    }

    if (debouncedValue === urlQuery) {
      setQuery(debouncedValue);
      return;
    }

    setQuery(debouncedValue);
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedValue.trim()) {
      params.set("q", debouncedValue);
    } else {
      params.delete("q");
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  }, [debouncedValue, pathname, router, searchParams, setQuery]);

  const handleClear = () => {
    skipNextUrlWrite.current = false;
    setInputValue("");
    clearQuery();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("q");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  return (
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
      <input
        type="search"
        value={inputValue}
        onChange={(event) => {
          skipNextUrlWrite.current = false;
          setInputValue(event.target.value);
        }}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-border-field bg-canvas py-2 pl-10 pr-10 text-sm text-ink outline-none ring-primary focus:ring-2"
      />
      {inputValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full motion-reduce:transition-none"
        >
          <X size={16} />
        </Button>
      ) : null}
    </div>
  );
}
