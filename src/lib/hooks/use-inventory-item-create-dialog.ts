import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { z } from "zod";

import { INVENTORY_ITEM_CREATE_COPY } from "@/copy/inventory-item-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useCreateInventoryItem } from "@/lib/hooks/use-inventory";
import { inventorySchema } from "@/lib/schemas/inventory-schema";
import { formatZodError } from "@/lib/schemas/schema-helpers";

const inventoryFormSchema = inventorySchema.omit({ clinic_id: true });

export type InventoryFormValues = z.input<typeof inventoryFormSchema>;

const defaultValues: InventoryFormValues = {
  name: "",
  category: "",
  unit: "",
  stock: "0",
  min_stock: "0",
  unit_price: "",
};

export function useInventoryItemCreateDialog(onSuccess: () => void) {
  const clinicId = useClinicId();
  const { mutate, isPending } = useCreateInventoryItem();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues,
  });

  const onSubmit = handleSubmit((data) => {
    if (!clinicId) {
      toast.error(INVENTORY_ITEM_CREATE_COPY.validation.clinicRequired);
      return;
    }

    const parsed = inventorySchema.safeParse({
      clinic_id: clinicId,
      ...data,
    });

    if (!parsed.success) {
      toast.error(formatZodError(parsed.error));
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        toast.success(INVENTORY_ITEM_CREATE_COPY.success);
        reset(defaultValues);
        onSuccess();
      },
      onError: (cause) => {
        toast.error(cause.message || INVENTORY_ITEM_CREATE_COPY.error);
      },
    });
  });

  return {
    register,
    errors,
    isPending: isPending || isSubmitting,
    reset: () => reset(defaultValues),
    handleSubmit: onSubmit,
  };
}
