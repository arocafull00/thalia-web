"use server";

import {
  insertTransactionCategory,
  renameTransactionCategory,
  setTransactionCategoryActive,
} from "@/dal/transaction-categories.server.dal";
import { logger } from "@/lib/logger";
import {
  transactionCategoryCreateSchema,
  type TransactionCategoryCreateInput,
  transactionCategoryRenameSchema,
  type TransactionCategoryRenameInput,
  transactionCategoryStatusSchema,
} from "@/lib/schemas/transaction-category-schema";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";
import { createClient } from "@/lib/supabase/server";
import type { TransactionCategory } from "@/types/database.types";

async function requireCategoryManager() {
  const supabase = await createClient();
  const [{ data: authData, error: authError }, clinicId] = await Promise.all([
    supabase.auth.getUser(),
    getServerActiveClinicId(),
  ]);

  if (authError || !authData.user) {
    throw new Error("Debes iniciar sesión para gestionar categorías.");
  }

  if (!clinicId) {
    throw new Error("No hay una clínica activa.");
  }

  const { data: membership, error: membershipError } = await supabase
    .from("clinic_memberships")
    .select("id")
    .eq("user_id", authData.user.id)
    .eq("clinic_id", clinicId)
    .eq("status", "active")
    .in("role", ["owner", "admin"])
    .maybeSingle();

  if (membershipError || !membership) {
    throw new Error("No tienes permisos para gestionar categorías.");
  }

  return { clinicId, userId: authData.user.id };
}

function categoryMutationError(cause: unknown) {
  if (cause instanceof Error && "code" in cause && cause.code === "23505") {
    return new Error("Ya existe una categoría con ese nombre y tipo.");
  }

  return cause instanceof Error ? cause : new Error(String(cause));
}

export async function createTransactionCategoryAction(
  input: TransactionCategoryCreateInput,
): Promise<TransactionCategory> {
  const parsed = transactionCategoryCreateSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Categoría no válida.");
  }

  const context = await requireCategoryManager();

  try {
    return await insertTransactionCategory({
      clinicId: context.clinicId,
      name: parsed.data.name,
      type: parsed.data.type,
    });
  } catch (cause) {
    const error = categoryMutationError(cause);
    logger.captureException(error, {
      action: "createTransactionCategory",
      clinicId: context.clinicId,
      userId: context.userId,
    });
    throw error;
  }
}

export async function renameTransactionCategoryAction(
  input: TransactionCategoryRenameInput,
): Promise<TransactionCategory> {
  const parsed = transactionCategoryRenameSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Categoría no válida.");
  }

  const context = await requireCategoryManager();

  try {
    return await renameTransactionCategory({
      categoryId: parsed.data.id,
      clinicId: context.clinicId,
      name: parsed.data.name,
    });
  } catch (cause) {
    const error = categoryMutationError(cause);
    logger.captureException(error, {
      action: "renameTransactionCategory",
      categoryId: parsed.data.id,
      clinicId: context.clinicId,
      userId: context.userId,
    });
    throw error;
  }
}

async function updateTransactionCategoryStatus(
  categoryId: string,
  isActive: boolean,
): Promise<TransactionCategory> {
  const parsed = transactionCategoryStatusSchema.safeParse({ id: categoryId });

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Categoría no válida.");
  }

  const context = await requireCategoryManager();

  try {
    return await setTransactionCategoryActive({
      categoryId: parsed.data.id,
      clinicId: context.clinicId,
      isActive,
    });
  } catch (cause) {
    const error = categoryMutationError(cause);
    logger.captureException(error, {
      action: isActive
        ? "restoreTransactionCategory"
        : "archiveTransactionCategory",
      categoryId: parsed.data.id,
      clinicId: context.clinicId,
      userId: context.userId,
    });
    throw error;
  }
}

export async function archiveTransactionCategoryAction(
  categoryId: string,
): Promise<TransactionCategory> {
  return updateTransactionCategoryStatus(categoryId, false);
}

export async function restoreTransactionCategoryAction(
  categoryId: string,
): Promise<TransactionCategory> {
  return updateTransactionCategoryStatus(categoryId, true);
}
