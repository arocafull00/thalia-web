"use client";

import { Flex } from "@radix-ui/themes";

import { SkeletonListItem } from "@/components/ui/primitives/skeleton-list-item";

/**
 * Filas para un listado que ocupa una `PageCard` entera. Cada fila mide 64 px
 * contando el hueco, así que diez llenan la tarjeta sin desbordarla en una
 * pantalla normal.
 *
 * El defecto de 5 se queda para las secciones embebidas —cronologías, panel de
 * notificaciones, movimientos—, donde diez filas se comerían el bloque.
 */
export const PAGE_LIST_SKELETON_ROWS = 10;

export function SkeletonList({ count = 5 }: { count?: number }) {
  return (
    <Flex direction="column" gap="2">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonListItem key={index} />
      ))}
    </Flex>
  );
}
