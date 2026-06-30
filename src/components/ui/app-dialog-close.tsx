"use client";

import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";

import { APP_DIALOG_COPY } from "@/components/ui/app-dialog-copy";

type AppDialogCloseProps = Dialog.DialogCloseProps;

export default function AppDialogClose({ className, ...props }: AppDialogCloseProps) {
  return (
    <Dialog.Close
      className={
        className ??
        "absolute right-4 top-4 rounded-full p-1 text-ink-muted hover:bg-canvas hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      }
      aria-label={APP_DIALOG_COPY.close}
      {...props}
    >
      <X size={16} />
    </Dialog.Close>
  );
}
