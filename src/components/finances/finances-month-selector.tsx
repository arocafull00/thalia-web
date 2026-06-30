"use client";

import * as Popover from "@radix-ui/react-popover";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { useRef, useState } from "react";

import { useFinancesUiStore } from "@/stores/finances-ui-store";

export default function FinancesMonthSelector() {
  const month = useFinancesUiStore((state) => state.month);
  const setMonth = useFinancesUiStore((state) => state.setMonth);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(format(month, "yyyy-MM"));
  const containerRef = useRef<HTMLDivElement>(null);
  const monthLabel = format(month, "MMMM yyyy", { locale: es }).replace(
    /^\w/,
    (character) => character.toUpperCase(),
  );

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValue(format(month, "yyyy-MM"));
    }
    setOpen(nextOpen);
  };

  const handleSelect = () => {
    const [year, monthPart] = value.split("-").map(Number);
    setMonth(new Date(year, monthPart - 1, 1));
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="flex items-center justify-between">
      <h2 className="text-lg font-medium capitalize text-ink">{monthLabel}</h2>
      <Popover.Root open={open} onOpenChange={handleOpenChange}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-primary-subtle/40 px-4 py-2 text-sm text-ink-secondary"
          >
            <Calendar size={16} />
            Cambiar
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content
            className="rounded-2xl border border-border bg-surface p-4 shadow-lg"
            sideOffset={8}
          >
            <input
              type="month"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="rounded-xl border border-border px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleSelect}
              className="mt-3 w-full rounded-full bg-primary px-4 py-2 text-xs uppercase tracking-wide text-on-primary"
            >
              Aplicar
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
