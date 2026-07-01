"use client";

import * as Dialog from "@radix-ui/react-dialog";

import AppDialogClose from "@/components/ui/app-dialog-close";

type AppSheetContentProps = Dialog.DialogContentProps & {
  showClose?: boolean;
};

export default function AppSheetContent({
  children,
  className,
  showClose = true,
  ...props
}: AppSheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40 data-[state=open]:animate-overlay-in data-[state=closed]:animate-overlay-out" />
      <Dialog.Content
        className={
          className ??
          "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-border bg-surface p-6 shadow-lg outline-none data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out"
        }
        {...props}
      >
        {children}
        {showClose ? <AppDialogClose /> : null}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
