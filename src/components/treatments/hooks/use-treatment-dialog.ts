import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import {
  useCreateTreatment,
  useUpdateTreatment,
} from "@/lib/hooks/use-treatment";
import { treatmentFormSchema } from "@/lib/schemas/treatment-schema";
import { notifySuccess } from "@/lib/sound";
import type { TreatmentWithInventory } from "@/types/database.types";

export type TreatmentFormValues = z.input<typeof treatmentFormSchema>;

const emptyValues: TreatmentFormValues = {
  name: "",
  category: "",
  duration_minutes: 30,
  price: null,
  color: null,
  inventoryLinks: [],
};

function toFormValues(
  treatment: TreatmentWithInventory | null,
): TreatmentFormValues {
  if (!treatment) {
    return emptyValues;
  }

  return {
    name: treatment.name,
    category: treatment.category ?? "",
    duration_minutes: treatment.duration_minutes ?? 30,
    price: treatment.price,
    color: treatment.color,
    inventoryLinks: treatment.treatment_inventory_items.map((link) => ({
      inventory_item_id: link.inventory_item_id,
      quantity: link.quantity,
    })),
  };
}

export function useTreatmentDialog(
  treatment: TreatmentWithInventory | null,
  onSuccess: () => void,
) {
  const clinicId = useClinicId();
  const { mutate: createTreatment, isPending: creating } = useCreateTreatment();
  const { mutate: updateTreatment, isPending: updating } = useUpdateTreatment();

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TreatmentFormValues>({
    resolver: zodResolver(treatmentFormSchema),
    defaultValues: toFormValues(treatment),
  });

  useEffect(() => {
    reset(toFormValues(treatment));
  }, [treatment, reset]);

  const onSubmit = handleSubmit((data) => {
    clearErrors("root");

    if (!clinicId) {
      setError("root", { message: TREATMENTS_COPY.dialog.clinicRequired });
      return;
    }

    const parsed = treatmentFormSchema.safeParse(data);

    if (!parsed.success) {
      return;
    }

    const payload = {
      name: parsed.data.name,
      category: parsed.data.category || null,
      duration_minutes: parsed.data.duration_minutes,
      price: parsed.data.price,
      color: parsed.data.color,
      inventoryLinks: parsed.data.inventoryLinks,
    };

    if (treatment) {
      updateTreatment(treatment.id, payload, {
        onSuccess: () => {
          notifySuccess(TREATMENTS_COPY.dialog.successUpdate);
          onSuccess();
        },
        onError: () => {
          setError("root", { message: TREATMENTS_COPY.dialog.error });
        },
      });
      return;
    }

    createTreatment(
      { clinic_id: clinicId, ...payload },
      {
        onSuccess: () => {
          notifySuccess(TREATMENTS_COPY.dialog.successCreate);
          reset(emptyValues);
          onSuccess();
        },
        onError: () => {
          setError("root", { message: TREATMENTS_COPY.dialog.error });
        },
      },
    );
  });

  return {
    register,
    control,
    errors,
    isPending: creating || updating || isSubmitting,
    handleSubmit: onSubmit,
    reset: () => reset(toFormValues(treatment)),
  };
}
