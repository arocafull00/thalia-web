"use client";

import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useFinancesUiStore } from "@/stores/finances-ui-store";

export default function FinancesMonthSelector() {
  const month = useFinancesUiStore((state) => state.month);
  const setMonth = useFinancesUiStore((state) => state.setMonth);

  const monthLabel = format(month, "MMMM yyyy", { locale: es }).replace(
    /^\w/,
    (c) => c.toUpperCase(),
  );

  const handlePrev = () => setMonth(addMonths(month, -1));
  const handleNext = () => setMonth(addMonths(month, 1));

  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={handlePrev}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-primary-subtle/50 hover:text-ink"
      >
        <ChevronLeft size={18} />
      </button>
      <span className="min-w-36 text-center text-base font-medium text-ink">
        {monthLabel}
      </span>
      <button
        type="button"
        onClick={handleNext}
        className="flex h-8 w-8 items-center justify-center rounded-full text-ink-secondary transition-colors hover:bg-primary-subtle/50 hover:text-ink"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
