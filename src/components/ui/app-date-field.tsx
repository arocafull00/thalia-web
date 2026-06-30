"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

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
  const [open, setOpen] = useState(false);
  const inputType = mode === "datetime-local" ? "datetime-local" : "date";
  const inputValue =
    mode === "datetime-local"
      ? value.toISOString().slice(0, 16)
      : value.toISOString().slice(0, 10);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className="rounded-xl border border-border px-3 py-2 text-sm"
        >
          {inputValue}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="rounded-2xl border border-border bg-surface p-4 shadow-lg">
          <input
            type={inputType}
            value={inputValue}
            onChange={(event) => onChange(new Date(event.target.value))}
            className="rounded-xl border border-border px-3 py-2 text-sm"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
