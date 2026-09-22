"use client";

import * as Dialog from "@radix-ui/react-dialog";

import AppDialogClose from "@/components/ui/app-dialog-close";
import { cn } from "@/lib/utils";

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
      <Dialog.Overlay className="motion-dialog-overlay fixed inset-0 z-50 bg-ink/40" />
      <Dialog.Content
        data-side="right"
        className={cn(
          "motion-sheet",
          className ??
            "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-lg flex-col border-l border-border/60 bg-surface p-6 shadow-float outline-none",
        )}
        {...props}
      >
        {children}
        {showClose ? <AppDialogClose /> : null}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
