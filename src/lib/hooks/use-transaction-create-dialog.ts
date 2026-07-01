import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";

import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import { useCreateTransaction } from "@/lib/hooks/use-finances";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import { transactionSchema } from "@/lib/schemas/transaction-schema";
import type { TransactionType } from "@/types/database.types";

const transactionFormSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.coerce
    .number({ message: "El importe no es válido." })
    .positive("El importe debe ser mayor que cero."),
  date: z.date(),
  category: z.string(),
  description: z.string(),
});

export type TransactionFormValues = z.input<typeof transactionFormSchema>;

function createDefaultValues(type: TransactionType): TransactionFormValues {
  return {
    type,
    amount: "",
    date: new Date(),
    category: "",
    description: "",
  };
}

export function useTransactionCreateDialog(
  initialType: TransactionType,
  onSuccess: () => void,
) {
  const clinicId = useClinicId();
  const { profile } = useAuth();
  const { mutate, isPending } = useCreateTransaction();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: createDefaultValues(initialType),
  });

  const prepare = (type: TransactionType) => {
    reset(createDefaultValues(type));
  };

  const onSubmit = handleSubmit((data) => {
    if (!clinicId) {
      toast.error(TRANSACTION_CREATE_COPY.validation.clinicRequired);
      return;
    }

    if (!profile?.id) {
      toast.error(TRANSACTION_CREATE_COPY.validation.profileRequired);
      return;
    }

    const parsed = transactionSchema.safeParse({
      clinic_id: clinicId,
      appointment_id: null,
      created_by: profile.id,
      type: data.type,
      amount: data.amount,
      date: format(data.date, "yyyy-MM-dd"),
      category: data.category,
      description: data.description,
    });

    if (!parsed.success) {
      toast.error(formatZodError(parsed.error));
      return;
    }

    mutate(parsed.data, {
      onSuccess: () => {
        toast.success(TRANSACTION_CREATE_COPY.success);
        reset(createDefaultValues(initialType));
        onSuccess();
      },
      onError: (cause) => {
        toast.error(cause.message || TRANSACTION_CREATE_COPY.error);
      },
    });
  });

  return {
    register,
    control,
    errors,
    isPending: isPending || isSubmitting,
    prepare,
    reset: () => reset(createDefaultValues(initialType)),
    handleSubmit: onSubmit,
  };
}
