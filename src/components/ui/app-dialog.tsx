"use client";

import * as Dialog from "@radix-ui/react-dialog";

type AppDialogProps = Dialog.DialogProps;

export default function AppDialog(props: AppDialogProps) {
  return <Dialog.Root {...props} />;
}
