import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type CampaignsPaginationProps = {
  pageIndex: number;
  pageSize: number;
  total: number;
  onPageChange: (pageIndex: number) => void;
};

export default function CampaignsPagination({
  pageIndex,
  pageSize,
  total,
  onPageChange,
}: CampaignsPaginationProps) {
  const start = total === 0 ? 0 : Math.min(pageIndex * pageSize + 1, total);
  const end = Math.min((pageIndex + 1) * pageSize, total);

  return (
    <nav
      aria-label="Paginación de campañas"
      className="flex items-center justify-between gap-3 border-t border-border-subtle pt-4 text-sm text-ink-secondary"
    >
      <span>
        {start}–{end} de {total}
      </span>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={pageIndex === 0}
          onClick={() => onPageChange(pageIndex - 1)}
        >
          <ChevronLeft aria-hidden="true" />
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={end >= total}
          onClick={() => onPageChange(pageIndex + 1)}
        >
          Siguiente
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  );
}
