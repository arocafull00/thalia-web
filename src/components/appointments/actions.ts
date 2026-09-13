"use server";

import { EXTERNAL_APPOINTMENT_COPY } from "@/copy/external-appointment-copy";
import { respondExternalAppointment } from "@/dal/appointments.server.dal";
import { logger } from "@/lib/logger";
import { externalAppointmentResponseSchema } from "@/lib/schemas/appointment-schema";
import { getServerActiveClinicId } from "@/lib/server/active-clinic";
import { createClient } from "@/lib/supabase/server";
import type {
  ExternalAppointmentResponseInput,
  ExternalAppointmentResponseResult,
} from "@/types/database.types";

export async function respondExternalAppointmentAction(
  input: ExternalAppointmentResponseInput,
): Promise<ExternalAppointmentResponseResult> {
  const parsed = externalAppointmentResponseSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(EXTERNAL_APPOINTMENT_COPY.errors.invalid);
  }

  const supabase = await createClient();
  const [{ data: claimsData, error: claimsError }, clinicId] =
    await Promise.all([supabase.auth.getClaims(), getServerActiveClinicId()]);
  const userId = claimsData?.claims?.sub;

  if (claimsError || typeof userId !== "string") {
    throw new Error(EXTERNAL_APPOINTMENT_COPY.errors.auth);
  }

  if (!clinicId) {
    throw new Error(EXTERNAL_APPOINTMENT_COPY.errors.clinic);
  }

  try {
    return await respondExternalAppointment(clinicId, parsed.data);
  } catch (cause) {
    logger.captureException(cause, {
      action: "respondExternalAppointment",
      appointmentId: parsed.data.appointmentId,
      clinicId,
      decision: parsed.data.decision,
      userId,
    });
    throw cause instanceof Error ? cause : new Error(String(cause));
  }
}
