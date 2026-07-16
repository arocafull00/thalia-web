import { z } from "zod";

import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";

export const inventoryAdjustStockSchema = z.object({
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

export type InventoryAdjustStockSubmitValues = z.output<
  typeof inventoryAdjustStockSchema
>;
