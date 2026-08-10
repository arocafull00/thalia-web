"use client";

import { SlidersHorizontal } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import FilterField from "@/components/ui/filter-field";
import PageSearchFilter from "@/components/ui/page-search-filter";

type PageFiltersBarProps = {
  search: string;
  searchLabel: string;
  searchPlaceholder: string;
  searchClearLabel: string;
  onSearchChange: (value: string) => void;
  onOpenSheet: () => void;
  children?: ReactNode;
  showMobileSheetButton?: boolean;
  trailingAction?: ReactNode;
};

export default function PageFiltersBar({
  search,
  searchLabel,
  searchPlaceholder,
  searchClearLabel,
  onSearchChange,
  onOpenSheet,
  children,
  showMobileSheetButton = true,
  trailingAction,
}: PageFiltersBarProps) {
  return (
    <div className="flex items-end gap-2">
      <FilterField
        label={searchLabel}
        className="min-w-0 flex-1 basis-full sm:basis-auto sm:w-72 sm:flex-none lg:w-96"
      >
        {({ controlId }) => (
          <PageSearchFilter
            id={controlId}
            value={search}
            placeholder={searchPlaceholder}
            clearLabel={searchClearLabel}
            onChange={onSearchChange}
          />
        )}
      </FilterField>
      {showMobileSheetButton ? (
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          onClick={onOpenSheet}
          aria-label="Filtros"
          className="mb-0.5 rounded-button sm:hidden motion-reduce:transition-none"
        >
          <SlidersHorizontal size={16} />
        </Button>
      ) : null}
      {children ? (
        <div className="hidden items-end gap-2 sm:flex">{children}</div>
      ) : null}
      {trailingAction}
    </div>
  );
}
