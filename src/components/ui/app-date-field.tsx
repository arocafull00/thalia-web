"use client";

import {
  formatLocalDateInputValue,
  formatLocalDatetimeInputValue,
  parseLocalDateInputValue,
  parseLocalDatetimeInputValue,
} from "@/lib/date-input";

const fieldClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type AppDateFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
  mode?: "date" | "datetime-local";
};

export default function AppDateField({
  value,
  onChange,
  mode = "date",
}: AppDateFieldProps) {
  if (mode === "datetime-local") {
    return (
      <input
        type="datetime-local"
        value={formatLocalDatetimeInputValue(value)}
        onChange={(event) =>
          onChange(parseLocalDatetimeInputValue(event.target.value))
        }
        className={fieldClassName}
      />
    );
  }

  return (
    <input
      type="date"
      value={formatLocalDateInputValue(value)}
      onChange={(event) =>
        onChange(parseLocalDateInputValue(event.target.value))
      }
      className={fieldClassName}
    />
  );
}
