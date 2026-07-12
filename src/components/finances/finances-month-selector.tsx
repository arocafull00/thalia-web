"use client";

import { addMonths, format } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
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
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={handlePrev}
        className="rounded-full"
      >
        <ChevronLeft size={18} />
      </Button>
      <span className="min-w-36 text-center text-base font-medium text-ink">
        {monthLabel}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={handleNext}
        className="rounded-full"
      >
        <ChevronRight size={18} />
      </Button>
    </div>
  );
}
