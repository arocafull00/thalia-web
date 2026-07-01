"use client";

import * as Popover from "@radix-ui/react-popover";

type AppDatePickerPopoverProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function AppDatePickerPopover({
  open,
  onClose,
  children,
}: AppDatePickerPopoverProps) {
  return (
    <Popover.Root
      open={open}
      onOpenChange={(nextOpen) => !nextOpen && onClose()}
    >
      <Popover.Anchor />
      <Popover.Portal>
        <Popover.Content
          className="pointer-events-auto z-100 rounded-2xl border border-border bg-surface p-4 shadow-lg"
          sideOffset={8}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
