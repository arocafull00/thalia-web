"use client";

import { Flex, Text } from "@radix-ui/themes";

export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
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
