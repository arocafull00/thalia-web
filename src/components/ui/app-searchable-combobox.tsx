"use client";

import { matchSorter } from "match-sorter";
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import AppSearchableComboboxItem from "@/components/ui/app-searchable-combobox-item";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxList,
  ComboboxTrigger,
} from "@/components/ui/combobox";
import { COMBOBOX_COPY } from "@/copy/combobox-copy";
import { cn } from "@/lib/utils";

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
  variant?: "input" | "pill";
  triggerLeading?: ReactNode;
  className?: string;
};

const inputTriggerClassName =
  "flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus-visible:ring-2 disabled:opacity-50 [&_[data-slot=combobox-trigger-icon]]:text-ink-muted";

const pillTriggerClassName =
  "inline-flex w-full items-center justify-between gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm text-ink-secondary disabled:opacity-50 [&_[data-slot=combobox-trigger-icon]]:text-ink-muted";

const popupClassName =
  "pointer-events-auto z-100 min-w-72 rounded-2xl border border-border bg-surface p-3 shadow-lg ring-0";

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
  variant = "input",
  triggerLeading,
  className,
}: AppSearchableComboboxProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [portalContainer, setPortalContainer] = useState<
    HTMLElement | undefined
  >(undefined);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  useLayoutEffect(() => {
    const dialog = rootRef.current?.closest('[role="dialog"]');

    if (dialog instanceof HTMLElement) {
      setPortalContainer(dialog);
      return;
    }

    setPortalContainer(undefined);
  }, []);

  const filteredOptions = useMemo(() => {
    const normalizedSearch = search.trim();

    if (!normalizedSearch) {
      return options;
    }

    const matches = matchSorter(options, normalizedSearch, {
      keys: ["label", "value"],
    });

    const selected = value
      ? options.find((option) => option.value === value)
      : null;

    if (selected && !matches.some((match) => match.value === selected.value)) {
      matches.push(selected);
    }

    return matches;
  }, [options, search, value]);

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

  const showInitialLoading = loading && !selectedOption;
  const showListLoading = loading;

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);

    if (!nextOpen) {
      setSearch("");
    }
  };

  const handleSearchChange = (nextSearch: string) => {
    setSearch(nextSearch);
  };

  const handleSelect = (nextValue: string | null) => {
    onValueChange(nextValue);
    setOpen(false);
    setSearch("");
  };

  const handleValueChange = (option: AppSearchableComboboxOption | null) => {
    handleSelect(option ? option.value : null);
  };

  const triggerClassName =
    variant === "pill" ? pillTriggerClassName : inputTriggerClassName;

  return (
    <div
      ref={rootRef}
      className={variant === "pill" ? "inline-block" : "w-full"}
    >
      <Combobox
        items={filteredOptions}
        filter={null}
        autoComplete="none"
        modal={false}
        value={selectedOption}
        onValueChange={handleValueChange}
        isItemEqualToValue={(item, selected) => item.value === selected.value}
        itemToStringValue={(option) => option.label}
        inputValue={search}
        onInputValueChange={handleSearchChange}
        open={open}
        onOpenChange={handleOpenChange}
        disabled={disabled || showInitialLoading}
      >
        <ComboboxTrigger className={cn(triggerClassName, className)}>
          <span className="flex min-w-0 flex-1 items-center gap-2 text-left">
            {!selectedOption && triggerLeading ? triggerLeading : null}
            {selectedOption?.leading ?? null}
            <span
              className={cn(
                "truncate",
                selectedOption ? "text-ink" : "text-ink-muted",
              )}
            >
              {showInitialLoading ? COMBOBOX_COPY.loading : triggerLabel}
            </span>
          </span>
        </ComboboxTrigger>
        <ComboboxContent
          container={portalContainer}
          sideOffset={8}
          className={cn(popupClassName, "max-h-none")}
        >
          <ComboboxInput
            showTrigger={false}
            placeholder={searchPlaceholder}
            className="mb-3 w-full rounded-xl border border-border bg-surface shadow-none ring-primary focus-within:ring-2"
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
            {showListLoading ? (
              <p className="px-3 py-2 text-sm text-ink-muted">
                {COMBOBOX_COPY.loading}
              </p>
            ) : null}
            {!showListLoading ? (
              <>
                <ComboboxEmpty className="px-3 py-2 text-ink-muted">
                  {emptyMessage}
                </ComboboxEmpty>
                <ComboboxList className="max-h-none p-0">
                  {(option: AppSearchableComboboxOption) => (
                    <AppSearchableComboboxItem
                      key={option.value}
                      option={option}
                    />
                  )}
                </ComboboxList>
              </>
            ) : null}
          </div>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
