"use client";

import * as Dialog from "@radix-ui/react-dialog";

import AppDialogClose from "@/components/ui/app-dialog-close";

type AppDialogContentProps = Dialog.DialogContentProps & {
  showClose?: boolean;
};

export default function AppDialogContent({
  children,
  className,
  showClose = true,
  ...props
}: AppDialogContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
      <Dialog.Content
        className={
          className ??
          "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-surface p-6 shadow-lg focus:outline-none"
        }
        {...props}
      >
        {children}
        {showClose ? <AppDialogClose /> : null}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
