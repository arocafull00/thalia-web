"use client";

import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";

type AppSearchableMultiSelectOptionProps = {
  id: string;
  label: string;
  checked: boolean;
  onToggle: (id: string) => void;
};

export default function AppSearchableMultiSelectOption({
  id,
  label,
  checked,
  onToggle,
}: AppSearchableMultiSelectOptionProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onToggle(id)}
      // whitespace-normal anula el nowrap que trae Button: sin él, un nombre de
      // tratamiento largo se desbordaba en lugar de partir línea.
      className="h-auto w-full cursor-pointer items-start justify-start gap-3 rounded-xl px-3 py-2.5 text-left text-sm whitespace-normal"
    >
      <span
        // mt-0.5 para que la casilla quede alineada con la primera línea del
        // texto cuando el nombre ocupa dos.
        className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-primary bg-primary text-on-primary"
            : "border-border bg-surface"
        }`}
      >
        {checked ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0 flex-1">{label}</span>
    </Button>
  );
}
