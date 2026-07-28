import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { useRecordInventoryMovement } from "@/lib/hooks/use-inventory";
import { applyInventoryMovementToStock } from "@/lib/inventory-stock";
import {
  createInventoryAdjustStockSchema,
  type InventoryAdjustStockFormValues,
  type InventoryAdjustStockSubmitValues,
} from "@/lib/schemas/inventory-adjust-stock-schema";
import { notifySuccess } from "@/lib/sound";
import { useAuthStore } from "@/stores/auth-store";
import type {
  InventoryItem,
  InventoryMovementType,
} from "@/types/database.types";

const defaultValues: InventoryAdjustStockFormValues = {
  type: "in",
  quantity: "1",
  notes: "",
};

type InventoryAdjustStockItem = Pick<InventoryItem, "id" | "stock" | "unit">;

export function useInventoryAdjustStockDialog(
  item: InventoryAdjustStockItem,
  onSuccess: () => void,
) {
  const profile = useAuthStore((state) => state.profile);
  const { mutate, isPending } = useRecordInventoryMovement();
  const currentStock = Number(item.stock ?? 0);
  const unit = item.unit;

  const schema = useMemo(
    () => createInventoryAdjustStockSchema(currentStock),
    [currentStock],
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<
    InventoryAdjustStockFormValues,
    unknown,
    InventoryAdjustStockSubmitValues
  >({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const movementType = useWatch({ control, name: "type" }) ?? "in";
  const rawQuantity = useWatch({ control, name: "quantity" });
  const parsedQuantity = Number(rawQuantity);
  const hasValidQuantity =
    Number.isFinite(parsedQuantity) && parsedQuantity > 0;
  const resultingStock = hasValidQuantity
    ? applyInventoryMovementToStock(
        currentStock,
        movementType as InventoryMovementType,
        parsedQuantity,
      )
    : null;

  const onSubmit = handleSubmit((data) => {
    clearErrors("root");

    if (!profile?.id) {
      setError("root", {
        message:
          INVENTORY_ITEM_DETAIL_COPY.adjustStock.validation.employeeRequired,
      });
      return;
    }

    mutate(
      {
        item_id: item.id,
        employee_id: profile.id,
        type: data.type as InventoryMovementType,
        quantity: data.quantity,
        notes: data.notes?.trim() ? data.notes.trim() : null,
      },
      {
        onSuccess: () => {
          notifySuccess(INVENTORY_ITEM_DETAIL_COPY.adjustStock.success);
          reset(defaultValues);
          onSuccess();
        },
        onError: (cause) => {
          setError("root", {
            message:
              cause.message || INVENTORY_ITEM_DETAIL_COPY.adjustStock.error,
          });
        },
      },
    );
  });

  return {
    register,
    control,
    errors,
    currentStock,
    resultingStock,
    unit,
    movementType,
    isPending: isPending || isSubmitting,
    reset: () => reset(defaultValues),
    handleSubmit: onSubmit,
  };
}
