"use client";

import * as Popover from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { COMBOBOX_COPY } from "@/copy/combobox-copy";

export type AppSearchableComboboxOption = {
  value: string;
  label: string;
  leading?: ReactNode;
};

type AppSearchableComboboxProps = {
  value: string | null;
  onValueChange: (value: string | null) => void;
  options: AppSearchableComboboxOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  allowClear?: boolean;
  clearLabel?: string;
  onSearchChange?: (query: string) => void;
  variant?: "input" | "pill";
  triggerLeading?: ReactNode;
  className?: string;
};

const inputTriggerClassName =
  "flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2 disabled:opacity-50";

const pillTriggerClassName =
  "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink-secondary disabled:opacity-50";

export default function AppSearchableCombobox({
  value,
  onValueChange,
  options,
  placeholder = COMBOBOX_COPY.searchPlaceholder,
  searchPlaceholder = COMBOBOX_COPY.searchPlaceholder,
  disabled = false,
  loading = false,
  emptyMessage = COMBOBOX_COPY.empty,
  allowClear = false,
  clearLabel,
  onSearchChange,
  variant = "input",
  triggerLeading,
  className,
}: AppSearchableComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredOptions = useMemo(() => {
    if (onSearchChange) {
      return options;
    }

    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return options;
    }

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalizedSearch),
    );
  }, [onSearchChange, options, search]);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) ?? null,
    [options, value],
  );

  const triggerLabel = useMemo(() => {
    if (selectedOption) {
      return selectedOption.label;
    }

    if (allowClear && value === null && clearLabel) {
      return clearLabel;
    }

    return placeholder;
  }, [allowClear, clearLabel, placeholder, selectedOption, value]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
      onSearchChange?.("");
    }
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
    onSearchChange?.(nextSearch);
  };

  const handleSelect = (nextValue: string | null) => {
    onValueChange(nextValue);
    setOpen(false);
    setSearch("");
    onSearchChange?.("");
  };

  const triggerClassName =
    variant === "pill" ? pillTriggerClassName : inputTriggerClassName;

  return (
    <Popover.Root open={open} onOpenChange={handleOpenChange}>
      <Popover.Trigger asChild>
        <button
          type="button"
          disabled={disabled || loading}
          className={`${triggerClassName} ${className ?? ""}`}
        >
          <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
            {!selectedOption && triggerLeading ? triggerLeading : null}
            {selectedOption?.leading ?? null}
            <span
              className={`truncate ${selectedOption ? "text-ink" : "text-ink-muted"}`}
            >
              {loading ? COMBOBOX_COPY.loading : triggerLabel}
            </span>
          </span>
          <ChevronDown size={16} className="shrink-0 text-ink-muted" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="z-50 w-(--radix-popover-trigger-width) min-w-72 rounded-2xl border border-border bg-surface p-3 shadow-lg"
          sideOffset={8}
        >
          <input
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="mb-3 w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none ring-primary focus:ring-2"
          />
          <div className="max-h-48 overflow-y-auto">
            {allowClear && clearLabel ? (
              <button
                type="button"
                onClick={() => handleSelect(null)}
                className="mb-2 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-canvas"
              >
                {triggerLeading}
                {clearLabel}
              </button>
            ) : null}
            {loading ? (
              <p className="px-3 py-2 text-sm text-ink-muted">
                {COMBOBOX_COPY.loading}
              </p>
            ) : null}
            {!loading && filteredOptions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-ink-muted">{emptyMessage}</p>
            ) : null}
            {!loading
              ? filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm hover:bg-canvas"
                  >
                    {option.leading}
                    {option.label}
                  </button>
                ))
              : null}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
