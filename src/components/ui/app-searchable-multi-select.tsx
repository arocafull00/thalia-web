"use client";

import { useMemo, useState } from "react";

import AppSearchableMultiSelectOption from "@/components/ui/app-searchable-multi-select-option";
import { COMBOBOX_COPY } from "@/copy/combobox-copy";

export type AppSearchableMultiSelectOption = {
  id: string;
  label: string;
};

type AppSearchableMultiSelectProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
  options: AppSearchableMultiSelectOption[];
  loading?: boolean;
  emptyMessage?: string;
  searchPlaceholder?: string;
};

export default function AppSearchableMultiSelect({
  selectedIds,
  onToggle,
  options,
  loading = false,
  emptyMessage = COMBOBOX_COPY.empty,
  searchPlaceholder = COMBOBOX_COPY.searchPlaceholder,
}: AppSearchableMultiSelectProps) {
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedSearch),
    );
  }, [options, search]);

  if (loading) {
    return <p className="text-sm text-ink-muted">{COMBOBOX_COPY.loading}</p>;
  }

  if (options.length === 0) {
    return <p className="text-sm text-ink-muted">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-2">
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        placeholder={searchPlaceholder}
        className="w-full rounded-xl border border-border-field bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2"
      />
      {/* max-h en vez de altura fija: con pocos tratamientos la caja se ajusta
          en lugar de dejar hueco vacío, y con muchos crece hasta el tope. Más
          bajo en móvil, donde el diálogo tiene menos sitio.
          no-scrollbar porque este scroll está anidado dentro del que ya tiene
          el cuerpo del diálogo, y dos barras juntas ensucian mucho. */}
      <div className="no-scrollbar max-h-52 space-y-1 overflow-y-auto rounded-xl border border-border-subtle p-2 sm:max-h-64">
        {filteredOptions.length === 0 ? (
          <p className="px-2 py-1.5 text-sm text-ink-muted">{emptyMessage}</p>
        ) : null}
        {filteredOptions.map((option) => (
          <AppSearchableMultiSelectOption
            key={option.id}
            id={option.id}
            label={option.label}
            checked={selectedIds.includes(option.id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
}
