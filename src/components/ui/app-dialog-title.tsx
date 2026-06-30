"use client";

import * as Dialog from "@radix-ui/react-dialog";

type AppDialogTitleProps = Dialog.DialogTitleProps;

export default function AppDialogTitle({ className, ...props }: AppDialogTitleProps) {
  return (
    <Dialog.Title
      className={className ?? "text-lg font-medium text-ink"}
      {...props}
    />
  );
}
