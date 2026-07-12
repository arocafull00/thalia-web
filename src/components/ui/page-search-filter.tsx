"use client";

import { Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useDebouncedValue } from "@/lib/hooks/use-debounced-value";

const SEARCH_DEBOUNCE_MS = 300;

type PageSearchFilterProps = {
  value: string;
  placeholder: string;
  clearLabel: string;
  onChange: (value: string) => void;
};

export default function PageSearchFilter({
  value,
  placeholder,
  clearLabel,
  onChange,
}: PageSearchFilterProps) {
  const [inputValue, setInputValue] = useState(value);
  const [prevValue, setPrevValue] = useState(value);
  const debouncedValue = useDebouncedValue(inputValue, SEARCH_DEBOUNCE_MS);
  const onChangeRef = useRef(onChange);

  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value);
  }

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    onChangeRef.current(debouncedValue);
  }, [debouncedValue]);

  return (
    <div className="relative w-full">
      <Search
        size={18}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        aria-hidden
      />
      <input
        type="search"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-full border border-border bg-surface py-2 pl-10 pr-10 text-sm text-ink outline-none ring-primary focus:ring-2"
      />
      {inputValue ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setInputValue("")}
          aria-label={clearLabel}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full motion-reduce:transition-none"
        >
          <X size={16} />
        </Button>
      ) : null}
    </div>
  );
}
