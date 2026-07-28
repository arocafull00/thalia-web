import { zodResolver } from "@hookform/resolvers/zod";
import { format, parseISO } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { TRANSACTION_CREATE_COPY } from "@/copy/transaction-create-copy";
import { useClinicId } from "@/lib/hooks/use-active-clinic";
import { useAuth } from "@/lib/hooks/use-auth";
import {
  useCreateTransaction,
  useUpdateTransaction,
} from "@/lib/hooks/use-finances";
import { formatZodError } from "@/lib/schemas/schema-helpers";
import {
  transactionSchema,
  transactionUpdateSchema,
} from "@/lib/schemas/transaction-schema";
import { notifySuccess } from "@/lib/sound";
import type { Transaction, TransactionType } from "@/types/database.types";

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

function createDefaultValues(
  type: TransactionType,
  transaction?: Transaction | null,
): TransactionFormValues {
  if (transaction) {
    return {
      type: transaction.type,
      amount: transaction.amount,
      date: transaction.date ? parseISO(transaction.date) : new Date(),
      category: transaction.category ?? "",
      description: transaction.description ?? "",
    };
  }

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
  transaction: Transaction | null = null,
) {
  const clinicId = useClinicId();
  const { profile } = useAuth();
  const { mutate: createMutate, isPending: isCreating } =
    useCreateTransaction();
  const { mutate: updateMutate, isPending: isUpdating } =
    useUpdateTransaction();
  const isEditing = Boolean(transaction);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: createDefaultValues(initialType, transaction),
  });

  useEffect(() => {
    reset(createDefaultValues(initialType, transaction));
  }, [initialType, reset, transaction]);

  const prepare = (type: TransactionType) => {
    reset(createDefaultValues(type));
  };

  const onSubmit = handleSubmit((data) => {
    clearErrors("root");

    const formattedDate = format(data.date, "yyyy-MM-dd");

    if (isEditing && transaction) {
      const parsed = transactionUpdateSchema.safeParse({
        type: data.type,
        amount: data.amount,
        date: formattedDate,
        category: data.category,
        description: data.description,
      });

      if (!parsed.success) {
        setError("root", { message: formatZodError(parsed.error) });
        return;
      }

      updateMutate(transaction.id, parsed.data, {
        onSuccess: () => {
          notifySuccess(TRANSACTION_CREATE_COPY.successEdit);
          reset(createDefaultValues(initialType));
          onSuccess();
        },
        onError: (cause) => {
          setError("root", {
            message: cause.message || TRANSACTION_CREATE_COPY.errorEdit,
          });
        },
      });
      return;
    }

    if (!clinicId) {
      setError("root", {
        message: TRANSACTION_CREATE_COPY.validation.clinicRequired,
      });
      return;
    }

    if (!profile?.id) {
      setError("root", {
        message: TRANSACTION_CREATE_COPY.validation.profileRequired,
      });
      return;
    }

    const parsed = transactionSchema.safeParse({
      clinic_id: clinicId,
      appointment_id: null,
      created_by: profile.id,
      type: data.type,
      amount: data.amount,
      date: formattedDate,
      category: data.category,
      description: data.description,
    });

    if (!parsed.success) {
      setError("root", { message: formatZodError(parsed.error) });
      return;
    }

    createMutate(parsed.data, {
      onSuccess: () => {
        notifySuccess(TRANSACTION_CREATE_COPY.success);
        reset(createDefaultValues(initialType));
        onSuccess();
      },
      onError: (cause) => {
        setError("root", {
          message: cause.message || TRANSACTION_CREATE_COPY.error,
        });
      },
    });
  });

  return {
    register,
    control,
    errors,
    isEditing,
    isPending: isCreating || isUpdating || isSubmitting,
    prepare,
    reset: () => reset(createDefaultValues(initialType, transaction)),
    handleSubmit: onSubmit,
  };
}
