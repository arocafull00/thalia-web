"use server";

import { markClinicNotificationsAsRead } from "@/dal/clinic-notifications.server.dal";
import { logger } from "@/lib/logger";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";
import { createClient } from "@/lib/supabase/server";

export async function markClinicNotificationsAsReadAction(): Promise<void> {
  const supabase = await createClient();
  const [{ data: claimsData, error: claimsError }, clinicId] =
    await Promise.all([supabase.auth.getClaims(), getServerActiveClinicId()]);
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string" || !clinicId) {
    return;
  }

  try {
    await markClinicNotificationsAsRead(clinicId, userId);
  } catch (cause) {
    logger.captureException(cause, {
      action: "markClinicNotificationsAsRead",
      clinicId,
      userId,
    });
    throw cause instanceof Error ? cause : new Error(String(cause));
  }
}
