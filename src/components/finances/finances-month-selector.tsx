"use client";

import { addMonths, format, parse } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatFinancesMonthParam } from "@/lib/finances-summary";

type FinancesMonthSelectorProps = {
  month: Date;
  onMonthChange: (month: Date) => void;
};

export default function FinancesMonthSelector({
  month,
  onMonthChange,
}: FinancesMonthSelectorProps) {
  const monthLabel = format(month, "MMMM yyyy", { locale: es }).replace(
    /^\w/,
    (c) => c.toUpperCase(),
  );

  const handlePrev = () => onMonthChange(addMonths(month, -1));
  const handleNext = () => onMonthChange(addMonths(month, 1));

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

export function parseFinancesMonthValue(value: string) {
  if (!value) {
    return new Date();
  }

  return parse(`${value}-01`, "yyyy-MM-dd", new Date());
}

export function financesMonthToParam(month: Date) {
  return formatFinancesMonthParam(month);
}
