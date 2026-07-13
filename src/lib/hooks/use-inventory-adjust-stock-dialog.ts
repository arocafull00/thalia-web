import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { useRecordInventoryMovement } from "@/lib/hooks/use-inventory";
import { notifySuccess } from "@/lib/sound";
import { useAuthStore } from "@/stores/auth-store";
import type { InventoryMovementType } from "@/types/database.types";

const inventoryAdjustStockSchema = z.object({
  type: z.enum(["in", "out", "adjustment"]),
  quantity: z.coerce
    .number({
      message:
        INVENTORY_ITEM_DETAIL_COPY.adjustStock.validation.quantityInvalid,
    })
    .positive(
      INVENTORY_ITEM_DETAIL_COPY.adjustStock.validation.quantityPositive,
    ),
  notes: z.string().trim().max(500).optional().or(z.literal("")),
});

export type InventoryAdjustStockFormValues = z.input<
  typeof inventoryAdjustStockSchema
>;

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
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryAdjustStockFormValues>({
    resolver: zodResolver(inventoryAdjustStockSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((data) => {
    if (!profile?.id) {
      toast.error(
        INVENTORY_ITEM_DETAIL_COPY.adjustStock.validation.employeeRequired,
      );
      return;
    }

    const parsed = inventoryAdjustStockSchema.safeParse(data);

    if (!parsed.success) {
      toast.error(
        parsed.error.issues[0]?.message ??
          INVENTORY_ITEM_DETAIL_COPY.adjustStock.error,
      );
      return;
    }

    mutate(
      {
        item_id: itemId,
        employee_id: profile.id,
        type: parsed.data.type as InventoryMovementType,
        quantity: parsed.data.quantity,
        notes: parsed.data.notes?.trim() ? parsed.data.notes.trim() : null,
      },
      {
        onSuccess: () => {
          notifySuccess(INVENTORY_ITEM_DETAIL_COPY.adjustStock.success);
          reset(defaultValues);
          onSuccess();
        },
        onError: (cause) => {
          toast.error(
            cause.message || INVENTORY_ITEM_DETAIL_COPY.adjustStock.error,
          );
        },
      },
    );
  });

  return {
    register,
    errors,
    isPending: isPending || isSubmitting,
    reset: () => reset(defaultValues),
    handleSubmit: onSubmit,
  };
}
