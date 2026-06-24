"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as Popover from "@radix-ui/react-popover";

import { useFinancesUiStore } from "@/stores/finances-ui-store";

export default function FinancesMonthSelector() {
  const month = useFinancesUiStore((state) => state.month);
  const setMonth = useFinancesUiStore((state) => state.setMonth);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(format(month, "yyyy-MM"));
  const containerRef = useRef<HTMLDivElement>(null);
  const monthLabel = format(month, "MMMM yyyy", { locale: es }).replace(/^\w/, (character) =>
    character.toUpperCase(),
  );

  useEffect(() => {
    setValue(format(month, "yyyy-MM"));
  }, [month]);

  const handleSelect = () => {
    const [year, monthPart] = value.split("-").map(Number);
    setMonth(new Date(year, monthPart - 1, 1));
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="flex items-center justify-between">
      <h2 className="text-lg font-medium capitalize text-zinc-900">{monthLabel}</h2>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-2 text-sm text-zinc-600"
          >
            <Calendar size={16} />
            Cambiar
          </button>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Content className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg" sideOffset={8}>
            <input
              type="month"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
            />
            <button
              type="button"
              onClick={handleSelect}
              className="mt-3 w-full rounded-full bg-zinc-900 px-4 py-2 text-xs uppercase tracking-wide text-white"
            >
              Aplicar
            </button>
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}
