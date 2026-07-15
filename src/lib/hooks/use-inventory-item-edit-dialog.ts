import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";

import { useUpdateInventoryItem } from "@/lib/hooks/use-inventory";
import { inventorySchema } from "@/lib/schemas/inventory-schema";
import type { InventoryItem } from "@/types/database.types";

const inventoryEditSchema = inventorySchema.omit({ clinic_id: true });

export type InventoryEditFormValues = z.input<typeof inventoryEditSchema>;

function toValues(item: InventoryItem): InventoryEditFormValues {
  return {
    name: item.name,
    category: item.category,
    unit: item.unit,
    stock: item.stock ?? 0,
    min_stock: item.min_stock ?? 0,
    unit_price: item.unit_price,
  };
}

export function useInventoryItemEditDialog(
  item: InventoryItem,
  onSuccess: () => void,
) {
  const { updateInventoryItem, isPending } = useUpdateInventoryItem();
  const form = useForm<InventoryEditFormValues>({
    resolver: zodResolver(inventoryEditSchema),
    defaultValues: toValues(item),
  });

  useEffect(() => {
    form.reset(toValues(item));
  }, [form, item]);

  const handleSubmit = form.handleSubmit(async (values) => {
    form.clearErrors("root");

    const parsed = inventoryEditSchema.safeParse(values);

    if (!parsed.success) {
      form.setError("root", {
        message: "Revisa los campos del material.",
      });
      return;
    }

    try {
      await updateInventoryItem(item.id, parsed.data);
      toast.success("Material actualizado correctamente.");
      onSuccess();
    } catch (cause) {
      form.setError("root", {
        message:
          cause instanceof Error
            ? cause.message
            : "No se pudo actualizar el material.",
      });
    }
  });

  return { ...form, isPending, handleSubmit };
}
