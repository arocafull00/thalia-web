"use client";

import type { AppSearchableComboboxOption } from "@/components/ui/app-searchable-combobox";
import { ComboboxItem } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

type AppSearchableComboboxItemProps = {
  option: AppSearchableComboboxOption;
};

const itemClassName =
  "h-8 rounded-md px-2 text-ink data-highlighted:bg-[var(--hover-overlay)] data-selected:bg-primary-subtle data-selected:text-ink [&_[data-slot=combobox-item-indicator]]:hidden";

export default function AppSearchableComboboxItem({
  option,
}: AppSearchableComboboxItemProps) {
  return (
    <ComboboxItem
      value={option}
      className={cn(itemClassName, "flex items-center justify-between gap-2")}
    >
      <span className="flex min-w-0 items-center gap-2 truncate">
        {option.leading}
        <span className="truncate">{option.label}</span>
      </span>
      {option.trailing ?? null}
    </ComboboxItem>
  );
}
