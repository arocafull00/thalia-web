"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FILES_COPY } from "@/copy/files-copy";
import { FILES_PAGE_SIZE } from "@/lib/hooks/use-files-page";

type FilesPaginationProps = {
  page: number;
  total: number;
  totalPages: number;
  disabled: boolean;
  onPageChange: (page: number) => void;
};

export default function FilesPagination({
  page,
  total,
  totalPages,
  disabled,
  onPageChange,
}: FilesPaginationProps) {
  if (total === 0) {
    return null;
  }

  const rangeFrom = (page - 1) * FILES_PAGE_SIZE + 1;
  const rangeTo = Math.min(page * FILES_PAGE_SIZE, total);

  return (
    <nav
      aria-label="Paginación de archivos"
      className="flex items-center justify-between border-t border-border-subtle pt-4"
    >
      <p className="hidden text-sm text-ink-muted sm:block">
        {FILES_COPY.pagination.range(rangeFrom, rangeTo, total)}
      </p>
      <p className="text-sm text-ink-muted sm:hidden">
        {FILES_COPY.pagination.page(page, totalPages)}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          <span className="hidden sm:inline">
            {FILES_COPY.pagination.previous}
          </span>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          <span className="hidden sm:inline">{FILES_COPY.pagination.next}</span>
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
