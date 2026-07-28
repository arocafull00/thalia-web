import { z } from "zod";

import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";

const inventoryAdjustStockBaseSchema = z.object({
  type: z.enum(["in", "out"]),
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

export function createInventoryAdjustStockSchema(currentStock: number) {
  return inventoryAdjustStockBaseSchema.superRefine((data, context) => {
    if (data.type !== "out") {
      return;
    }

    if (data.quantity > currentStock) {
      context.addIssue({
        code: "custom",
        path: ["quantity"],
        message:
          INVENTORY_ITEM_DETAIL_COPY.adjustStock.validation.insufficientStock,
      });
    }
  });
}

export const inventoryAdjustStockSchema = createInventoryAdjustStockSchema(0);

export type InventoryAdjustStockFormValues = z.input<
  typeof inventoryAdjustStockBaseSchema
>;

export type InventoryAdjustStockSubmitValues = z.output<
  ReturnType<typeof createInventoryAdjustStockSchema>
>;
