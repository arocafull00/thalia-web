"use client";

import { Box } from "@radix-ui/themes";

export function SkeletonListItem() {
  return <Box className="h-14 animate-pulse rounded-lg bg-primary-subtle/40" />;
}
