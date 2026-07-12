"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import PageSearchFilter from "@/components/ui/page-search-filter";

type PageFiltersBarProps = {
  search: string;
  searchPlaceholder: string;
  searchClearLabel: string;
  onSearchChange: (value: string) => void;
  onOpenSheet: () => void;
  children?: ReactNode;
  showMobileSheetButton?: boolean;
};

export default function PageFiltersBar({
  search,
  searchPlaceholder,
  searchClearLabel,
  onSearchChange,
  onOpenSheet,
  children,
  showMobileSheetButton = true,
}: PageFiltersBarProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0 flex-1 basis-full sm:basis-auto sm:w-72 sm:flex-none lg:w-96">
        <PageSearchFilter
          value={search}
          placeholder={searchPlaceholder}
          clearLabel={searchClearLabel}
          onChange={onSearchChange}
        />
      </div>
      {showMobileSheetButton ? (
        <button
          type="button"
          onClick={onOpenSheet}
          aria-label="Filtros"
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-button border border-border/60 bg-surface text-ink-secondary hover:bg-[var(--hover-overlay)] motion-reduce:transition-none sm:hidden"
        >
          <SlidersHorizontal size={16} />
        </button>
      ) : null}
      {children ? (
        <div className="hidden items-center gap-2 sm:flex">{children}</div>
      ) : null}
    </div>
  );
}
