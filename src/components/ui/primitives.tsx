"use client";

import { Box, Callout, Flex, Text } from "@radix-ui/themes";

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

export function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <Flex direction="column" gap="1">
      <Text size="6" weight="medium">
        {title}
      </Text>
      {subtitle ? (
        <Text size="2" color="gray">
          {subtitle}
        </Text>
      ) : null}
    </Flex>
  );
}

export function ActionButton({
  title,
  onClick,
  disabled,
  variant = "solid",
}: {
  title: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "solid" | "ghost";
}) {
  if (variant === "ghost") {
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={onClick}
        className="rounded-full border border-zinc-200 px-4 py-2 text-xs font-medium uppercase tracking-wide text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
      >
        {title}
      </button>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="rounded-full bg-zinc-900 px-4 py-2 text-xs font-medium uppercase tracking-wide text-white hover:bg-zinc-800 disabled:opacity-50"
    >
      {title}
    </button>
  );
}

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <Flex direction="column" gap="2">
      {Array.from({ length: count }).map((_, index) => (
        <Box key={index} className="h-14 animate-pulse rounded-lg bg-zinc-100" />
      ))}
    </Flex>
  );
}

export function SkeletonBlock({ height = 120 }: { height?: number }) {
  return <Box className="animate-pulse rounded-lg bg-zinc-100" style={{ height }} />;
}
