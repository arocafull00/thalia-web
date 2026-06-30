"use client";

import { Box } from "@radix-ui/themes";

export function SkeletonBlock({ height = 120 }: { height?: number }) {
  return (
    <Box
      className="animate-pulse rounded-lg bg-primary-subtle/40"
      style={{ height }}
    />
  );
}
