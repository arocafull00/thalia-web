"use client";

import type { AppSearchableComboboxOption } from "@/components/ui/app-searchable-combobox";
import { ComboboxItem } from "@/components/ui/combobox";
import { cn } from "@/lib/utils";

type AppSearchableComboboxItemProps = {
  option: AppSearchableComboboxOption;
};

const itemClassName =
  "rounded-xl px-3 py-2 text-ink data-highlighted:bg-canvas data-selected:bg-primary-subtle data-selected:text-ink [&_[data-slot=combobox-item-indicator]]:hidden";

export default function AppSearchableComboboxItem({
  option,
}: AppSearchableComboboxItemProps) {
  return (
    <ComboboxItem value={option} className={cn(itemClassName)}>
      {option.leading}
      {option.label}
    </ComboboxItem>
  );
}
