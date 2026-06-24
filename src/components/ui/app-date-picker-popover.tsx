"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";

type AppDatePickerPopoverProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function AppDatePickerPopover({ open, onClose, children }: AppDatePickerPopoverProps) {
  return (
    <Popover.Root open={open} onOpenChange={(nextOpen) => !nextOpen && onClose()}>
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg" sideOffset={8}>
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export function AppDateField({
  value,
  onChange,
  mode = "date",
}: {
  value: Date;
  onChange: (value: Date) => void;
  mode?: "date" | "datetime-local";
}) {
  const [open, setOpen] = useState(false);
  const inputType = mode === "datetime-local" ? "datetime-local" : "date";
  const inputValue =
    mode === "datetime-local"
      ? value.toISOString().slice(0, 16)
      : value.toISOString().slice(0, 10);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button type="button" className="rounded-xl border border-zinc-200 px-3 py-2 text-sm">
          {inputValue}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-lg">
          <input
            type={inputType}
            value={inputValue}
            onChange={(event) => onChange(new Date(event.target.value))}
            className="rounded-xl border border-zinc-200 px-3 py-2 text-sm"
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
