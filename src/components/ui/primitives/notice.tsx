"use client";

import { Callout } from "@radix-ui/themes";

type NoticeProps = {
  message: string;
  tone?: "danger" | "warning" | "neutral";
};

export function Notice({ message, tone = "neutral" }: NoticeProps) {
  const color =
    tone === "danger" ? "red" : tone === "warning" ? "amber" : "gray";

  return (
    <Callout.Root color={color} size="1">
      <Callout.Text>{message}</Callout.Text>
    </Callout.Root>
  );
}
