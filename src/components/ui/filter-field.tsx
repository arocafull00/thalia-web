"use client";

import { useId, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FilterFieldIds = {
  controlId: string;
  labelId: string;
};

type FilterFieldProps = {
  label: string;
  children: (ids: FilterFieldIds) => ReactNode;
  variant?: "bar" | "sheet";
  association?: "for" | "labelledby";
  className?: string;
};

const wrapperClassName = {
  bar: "min-w-0 space-y-1",
  sheet: "min-w-0 space-y-2",
} as const;

const labelClassName = {
  bar: "block truncate text-xs font-medium text-ink-secondary",
  sheet: "block text-sm font-medium text-ink",
} as const;

export default function FilterField({
  label,
  children,
  variant = "bar",
  association = "for",
  className,
}: FilterFieldProps) {
  const generatedId = useId();
  const controlId = `${generatedId}-control`;
  const labelId = `${generatedId}-label`;

  return (
    <div className={cn(wrapperClassName[variant], className)}>
      {association === "labelledby" ? (
        <span id={labelId} className={labelClassName[variant]}>
          {label}
        </span>
      ) : (
        <label
          id={labelId}
          htmlFor={controlId}
          className={labelClassName[variant]}
        >
          {label}
        </label>
      )}
      {children({ controlId, labelId })}
    </div>
  );
}
