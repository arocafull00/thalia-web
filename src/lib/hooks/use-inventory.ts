import { useCallback, useEffect } from "react";

import { useInventoryStore, type InventoryItemInput } from "@/stores/inventory-store";
import type { InventoryMovementType } from "@/types/database.types";

export type { InventoryItemInput };

export function useInventoryItems() {
  const entry = useInventoryStore((state) => state.list);
  const fetchInventoryItems = useInventoryStore((state) => state.fetchInventoryItems);

  useEffect(() => {
    void fetchInventoryItems();
  }, [fetchInventoryItems]);

  return {
    data: entry.data ?? undefined,
    isLoading: entry.loading,
    error: entry.error,
  };
}

export function useInventoryItem(itemId: string) {
  const entry = useInventoryStore((state) => state.byId[itemId]);
  const fetchInventoryItem = useInventoryStore((state) => state.fetchInventoryItem);

  useEffect(() => {
    void fetchInventoryItem(itemId);
  }, [fetchInventoryItem, itemId]);

  return {
    data: entry?.data,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function useInventoryMovements(itemId: string) {
  const entry = useInventoryStore((state) => state.movementsByItemId[itemId]);
  const fetchInventoryMovements = useInventoryStore((state) => state.fetchInventoryMovements);

  useEffect(() => {
    void fetchInventoryMovements(itemId);
  }, [fetchInventoryMovements, itemId]);

  return {
    data: entry?.data ?? undefined,
    isLoading: entry?.loading ?? true,
    error: entry?.error,
  };
}

export function useCreateInventoryItem() {
  const createInventoryItem = useInventoryStore((state) => state.createInventoryItem);
  const isPending = useInventoryStore((state) => state.creating);
  const error = useInventoryStore((state) => state.createError);

  const mutate = useCallback(
    (
      input: InventoryItemInput,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      createInventoryItem(input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(cause instanceof Error ? cause : new Error(String(cause))),
        );
    },
    [createInventoryItem],
  );

  return { mutate, isPending, error };
}

export function useRecordInventoryMovement() {
  const recordInventoryMovement = useInventoryStore((state) => state.recordInventoryMovement);
  const isPending = useInventoryStore((state) => state.recording);
  const error = useInventoryStore((state) => state.recordError);

  const mutate = useCallback(
    (
      input: {
        item_id: string;
        employee_id: string;
        type: InventoryMovementType;
        quantity: number;
        notes: string | null;
      },
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      recordInventoryMovement(input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(cause instanceof Error ? cause : new Error(String(cause))),
        );
    },
    [recordInventoryMovement],
  );

  return { mutate, isPending, error };
}
