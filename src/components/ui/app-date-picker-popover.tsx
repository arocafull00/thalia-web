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
          className="pointer-events-auto z-100 rounded-[14px] border border-border/60 bg-surface p-3 shadow-float"
          sideOffset={8}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
