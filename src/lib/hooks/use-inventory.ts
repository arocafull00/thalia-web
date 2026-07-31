import { useCallback, useEffect } from "react";

import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useClinicServerSeed,
  useServerSeed,
} from "@/lib/hooks/use-server-seed";
import {
  useInventoryStore,
  type InventoryItemInput,
} from "@/stores/inventory-store";
import { isInitialLoading } from "@/stores/query-state";
import type {
  InventoryItem,
  InventoryMovementType,
  InventoryMovementWithEmployee,
} from "@/types/database.types";

export type { InventoryItemInput };

export function useInventoryItems(initialData?: InventoryItem[]) {
  const entry = useInventoryStore((state) => state.list);
  const fetchInventoryItems = useInventoryStore(
    (state) => state.fetchInventoryItems,
  );
  const clinicId = useClinicId();
  const seededData = useClinicServerSeed(clinicId, initialData);
  const hasClientData = entry.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchInventoryItems();
  }, [clinicId, fetchInventoryItems, hasClientData, seededData]);

  const data = entry.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry.error,
  };
}

export function useInventoryItem(itemOrId: InventoryItem | string) {
  const itemId = typeof itemOrId === "string" ? itemOrId : itemOrId.id;
  const initialData = typeof itemOrId === "string" ? undefined : itemOrId;
  const entry = useInventoryStore((state) => state.byId[itemId]);
  const fetchInventoryItem = useInventoryStore(
    (state) => state.fetchInventoryItem,
  );
  const seededData = useServerSeed(itemId, initialData?.id ?? "", initialData);
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchInventoryItem(itemId);
  }, [fetchInventoryItem, hasClientData, itemId, seededData]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useInventoryMovements(
  itemId: string,
  initialData?: InventoryMovementWithEmployee[],
) {
  const entry = useInventoryStore((state) => state.movementsByItemId[itemId]);
  const fetchInventoryMovements = useInventoryStore(
    (state) => state.fetchInventoryMovements,
  );
  const seededData = useServerSeed(
    itemId,
    initialData === undefined ? "" : itemId,
    initialData,
  );
  const hasClientData = entry?.data != null;

  useEffect(() => {
    if (seededData !== undefined && !hasClientData) {
      return;
    }

    void fetchInventoryMovements(itemId);
  }, [fetchInventoryMovements, hasClientData, itemId, seededData]);

  const data = entry?.data ?? seededData;

  return {
    data,
    isLoading: data == null && isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useCreateInventoryItem() {
  const createInventoryItem = useInventoryStore(
    (state) => state.createInventoryItem,
  );
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
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [createInventoryItem],
  );

  return { mutate, isPending, error };
}

export function useUpdateInventoryItem() {
  const updateInventoryItem = useInventoryStore(
    (state) => state.updateInventoryItem,
  );
  const isPending = useInventoryStore((state) => state.updating);

  return { updateInventoryItem, isPending };
}

export function useRecordInventoryMovement() {
  const recordInventoryMovement = useInventoryStore(
    (state) => state.recordInventoryMovement,
  );
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
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [recordInventoryMovement],
  );

  return { mutate, isPending, error };
}
