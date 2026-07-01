"use client";

import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";

import {
  formatLocalDateInputValue,
  parseLocalDateInputValue,
} from "@/lib/date-input";

const fieldClassName =
  "w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none ring-primary focus:ring-2";

type AppDatePopoverFieldProps = {
  value: Date;
  onChange: (value: Date) => void;
};

export default function AppDatePopoverField({
  value,
  onChange,
}: AppDatePopoverFieldProps) {
  const [open, setOpen] = useState(false);
  const inputValue = formatLocalDateInputValue(value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className={fieldClassName}>
          {inputValue}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="pointer-events-auto z-100 rounded-2xl border border-border bg-surface p-4 shadow-lg"
          sideOffset={8}
        >
          <input
            type="date"
            value={inputValue}
            onChange={(event) => {
              onChange(parseLocalDateInputValue(event.target.value));
              setOpen(false);
            }}
            className={fieldClassName}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
