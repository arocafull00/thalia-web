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
      className="h-auto w-full cursor-pointer justify-start gap-2.5 rounded-xl px-2 py-1.5 text-left text-sm"
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
          checked
            ? "border-primary bg-primary text-on-primary"
            : "border-border bg-surface"
        }`}
      >
        {checked ? <Check size={12} strokeWidth={3} /> : null}
      </span>
      <span>{label}</span>
    </Button>
  );
}
