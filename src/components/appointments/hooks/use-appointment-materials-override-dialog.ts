import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { APPOINTMENT_DETAIL_COPY } from "@/copy/appointment-detail-copy";
import { useReplaceAppointmentInventoryItems } from "@/lib/hooks/use-appointments";
import {
  appointmentMaterialsFormSchema,
  type AppointmentMaterialsFormValues,
  type AppointmentMaterialsSubmitValues,
} from "@/lib/schemas/appointment-materials-schema";
import { notifySuccess } from "@/lib/sound";
import type { AppointmentInventoryItemWithInventory } from "@/types/database.types";

function toFormValues(
  items: AppointmentInventoryItemWithInventory[],
): AppointmentMaterialsFormValues {
  return {
    items: items.map((item) => ({
      inventory_item_id: item.inventory_item_id,
      quantity: item.quantity,
    })),
  };
}

export function useAppointmentMaterialsOverrideDialog(
  appointmentId: string,
  initialItems: AppointmentInventoryItemWithInventory[],
  onSuccess: () => void,
) {
  const { mutateAsync, isPending } = useReplaceAppointmentInventoryItems();

  const {
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<
    AppointmentMaterialsFormValues,
    unknown,
    AppointmentMaterialsSubmitValues
  >({
    resolver: zodResolver(appointmentMaterialsFormSchema),
    defaultValues: toFormValues(initialItems),
  });

  useEffect(() => {
    reset(toFormValues(initialItems));
  }, [initialItems, reset]);

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root");

    try {
      await mutateAsync({
        appointmentId,
        items: data.items,
      });
      notifySuccess(APPOINTMENT_DETAIL_COPY.materialsSuccess);
      onSuccess();
    } catch {
      setError("root", { message: APPOINTMENT_DETAIL_COPY.materialsError });
    }
  });

  const resetToDefault = async () => {
    clearErrors("root");

    try {
      await mutateAsync({
        appointmentId,
        items: [],
      });
      reset({ items: [] });
      notifySuccess(APPOINTMENT_DETAIL_COPY.materialsSuccess);
      onSuccess();
    } catch {
      setError("root", { message: APPOINTMENT_DETAIL_COPY.materialsError });
    }
  };

  return {
    control,
    errors,
    isPending: isPending || isSubmitting,
    handleSubmit: onSubmit,
    resetToDefault,
    reset: () => reset(toFormValues(initialItems)),
  };
}
