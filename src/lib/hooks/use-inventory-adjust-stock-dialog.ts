import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { useRecordInventoryMovement } from "@/lib/hooks/use-inventory";
import {
  inventoryAdjustStockSchema,
  type InventoryAdjustStockFormValues,
  type InventoryAdjustStockSubmitValues,
} from "@/lib/schemas/inventory-adjust-stock-schema";
import { notifySuccess } from "@/lib/sound";
import { useAuthStore } from "@/stores/auth-store";
import type { InventoryMovementType } from "@/types/database.types";

const defaultValues: InventoryAdjustStockFormValues = {
  type: "in",
  quantity: "1",
  notes: "",
};

export function useInventoryAdjustStockDialog(
  itemId: string,
  onSuccess: () => void,
) {
  const profile = useAuthStore((state) => state.profile);
  const { mutate, isPending } = useRecordInventoryMovement();

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
    resolver: zodResolver(inventoryAdjustStockSchema),
    defaultValues,
  });

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
        item_id: itemId,
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
    isPending: isPending || isSubmitting,
    reset: () => reset(defaultValues),
    handleSubmit: onSubmit,
  };
}
