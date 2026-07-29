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
import { Button } from "@/components/ui/button";
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
  trailing?: ReactNode;
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
  triggerTrailing?: ReactNode;
  className?: string;
  showSearch?: boolean;
  testId?: string;
};

const inputTriggerClassName =
  "flex w-full items-center justify-between gap-2 rounded-input border border-border-field bg-surface px-3 py-2 text-sm outline-none focus-visible:border-primary disabled:opacity-[var(--disabled-opacity)] [&_[data-slot=combobox-trigger-icon]]:text-ink-muted";

const pillTriggerClassName =
  "inline-flex w-full items-center justify-between gap-2 rounded-full border border-border-field bg-surface px-3 py-1.5 text-sm text-ink-secondary disabled:opacity-[var(--disabled-opacity)] [&_[data-slot=combobox-trigger-icon]]:text-ink-muted";

const popupClassName =
  "pointer-events-auto z-100 min-w-64 rounded-[14px] border border-border/60 bg-surface p-2 shadow-float ring-0";

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
  triggerTrailing,
  className,
  showSearch = true,
  testId,
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
    <div ref={rootRef} className="w-full min-w-0">
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
        <ComboboxTrigger
          data-testid={testId}
          className={cn(triggerClassName, className)}
        >
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
          {triggerTrailing ?? null}
        </ComboboxTrigger>
        <ComboboxContent
          container={portalContainer}
          sideOffset={8}
          className={popupClassName}
        >
          {showSearch ? (
            <ComboboxInput
              showTrigger={false}
              placeholder={searchPlaceholder}
              className="mb-2 w-full rounded-input border border-border-field bg-surface shadow-none focus-within:border-primary"
            />
          ) : null}
          {allowClear && clearLabel ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => handleSelect(null)}
              className="mb-1 w-full justify-start rounded-md px-2 py-1.5 text-left text-sm"
            >
              {triggerLeading}
              {clearLabel}
            </Button>
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
              <ComboboxList className="p-0">
                {(option: AppSearchableComboboxOption) => (
                  <AppSearchableComboboxItem
                    key={option.value}
                    option={option}
                  />
                )}
              </ComboboxList>
            </>
          ) : null}
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
