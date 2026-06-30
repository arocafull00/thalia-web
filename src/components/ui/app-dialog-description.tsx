"use client";

import * as Dialog from "@radix-ui/react-dialog";

type AppDialogDescriptionProps = Dialog.DialogDescriptionProps;

export default function AppDialogDescription({ className, ...props }: AppDialogDescriptionProps) {
  return (
    <Dialog.Description
      className={className ?? "text-sm text-ink-secondary"}
      {...props}
    />
  );
}
