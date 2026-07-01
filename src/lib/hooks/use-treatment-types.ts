import { useCallback, useEffect } from "react";

import { isInitialLoading } from "@/stores/query-state";
import {
  useTreatmentTypesStore,
  type TreatmentTypeInput,
  type TreatmentTypeUpdateInput,
} from "@/stores/treatment-types-store";

export type {
  TreatmentInventoryLinkInput,
  TreatmentTypeInput,
  TreatmentTypeUpdateInput,
} from "@/stores/treatment-types-store";

export function useTreatmentTypes() {
  const entry = useTreatmentTypesStore((state) => state.list);
  const fetchTreatmentTypes = useTreatmentTypesStore(
    (state) => state.fetchTreatmentTypes,
  );

  useEffect(() => {
    void fetchTreatmentTypes();
  }, [fetchTreatmentTypes]);

  return {
    data: entry.data ?? undefined,
    isLoading: isInitialLoading(entry),
    error: entry.error,
  };
}

export function useTreatmentType(treatmentTypeId: string) {
  const entry = useTreatmentTypesStore((state) => state.byId[treatmentTypeId]);
  const fetchTreatmentType = useTreatmentTypesStore(
    (state) => state.fetchTreatmentType,
  );

  useEffect(() => {
    void fetchTreatmentType(treatmentTypeId);
  }, [fetchTreatmentType, treatmentTypeId]);

  return {
    data: entry?.data,
    isLoading: isInitialLoading(entry),
    error: entry?.error,
  };
}

export function useCreateTreatmentType() {
  const createTreatmentType = useTreatmentTypesStore(
    (state) => state.createTreatmentType,
  );
  const isPending = useTreatmentTypesStore((state) => state.creating);
  const error = useTreatmentTypesStore((state) => state.createError);

  const mutate = useCallback(
    (
      input: TreatmentTypeInput,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      createTreatmentType(input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [createTreatmentType],
  );

  return { mutate, isPending, error };
}

export function useUpdateTreatmentType() {
  const updateTreatmentType = useTreatmentTypesStore(
    (state) => state.updateTreatmentType,
  );
  const isPending = useTreatmentTypesStore((state) => state.updating);
  const error = useTreatmentTypesStore((state) => state.updateError);

  const mutate = useCallback(
    (
      treatmentTypeId: string,
      input: TreatmentTypeUpdateInput,
      options?: { onSuccess?: () => void; onError?: (error: Error) => void },
    ) => {
      updateTreatmentType(treatmentTypeId, input)
        .then(() => options?.onSuccess?.())
        .catch((cause) =>
          options?.onError?.(
            cause instanceof Error ? cause : new Error(String(cause)),
          ),
        );
    },
    [updateTreatmentType],
  );

  return { mutate, isPending, error };
}
