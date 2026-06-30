"use client";

import { Flex } from "@radix-ui/themes";

import { SkeletonListItem } from "@/components/ui/primitives/skeleton-list-item";

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <Flex direction="column" gap="2">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonListItem key={index} />
      ))}
    </Flex>
  );
}
