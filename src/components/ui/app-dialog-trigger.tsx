"use client";

import * as Dialog from "@radix-ui/react-dialog";

type AppDialogTriggerProps = Dialog.DialogTriggerProps;

export default function AppDialogTrigger(props: AppDialogTriggerProps) {
  return <Dialog.Trigger {...props} />;
}
