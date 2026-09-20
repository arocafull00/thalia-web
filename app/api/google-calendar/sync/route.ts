import { createHash, timingSafeEqual } from "node:crypto";

import {
  deleteEvent,
  insertEvent,
  patchEvent,
} from "@/lib/google-calendar/calendar";
import {
  buildGoogleEvent,
  shouldSyncStatus,
  type CalendarSyncPayload,
} from "@/lib/google-calendar/event";
import { refreshAccessToken } from "@/lib/google-calendar/server";
import { logger } from "@/lib/logger";
import { createAdminClient } from "@/lib/supabase/admin";

const BATCH_SIZE = 50;

type ClaimedRow = {
  id: number;
  appointment_id: string;
  employee_id: string;
  operation: "upsert" | "delete";
  payload: CalendarSyncPayload & { google_event_id?: string };
  attempts: number;
  calendar_id: string | null;
  connection_status: "active" | "needs_reauth" | null;
  google_event_id: string | null;
  clinic_name: string | null;
};

/*
 * Comparación de longitud constante sobre el hash y no sobre el secreto: así
 * ambos lados miden lo mismo —`timingSafeEqual` exige longitudes iguales— y de
 * paso no se filtra la longitud del secreto por el tiempo de respuesta.
 */
function isAuthorised(request: Request, secret: string): boolean {
  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ") ? header.slice(7) : "";

  return timingSafeEqual(
    createHash("sha256").update(provided).digest(),
    createHash("sha256").update(secret).digest(),
  );
}

/*
 * Google deja de aceptar el refresh token cuando el usuario revoca el permiso
 * desde su cuenta o cambia la contraseña. Reintentar no lo va a arreglar: se
 * marca la conexión y Ajustes pasa a pedir que se vuelva a conectar.
 */
function isRevoked(cause: unknown): boolean {
  const message = cause instanceof Error ? cause.message : String(cause);

  return (
    message.includes("invalid_grant") ||
    message.includes("Token has been expired")
  );
}

export async function POST(request: Request) {
  const secret = process.env.THALIA_CALENDAR_SYNC_SECRET;

  if (!secret) {
    return Response.json(
      { error: "THALIA_CALENDAR_SYNC_SECRET no está configurada" },
      { status: 500 },
    );
  }

  if (!isAuthorised(request, secret)) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }

  const admin = createAdminClient();

  const { data, error } = await admin.rpc("claim_calendar_sync_batch", {
    p_limit: BATCH_SIZE,
  });

  if (error) {
    logger.captureException(error, { action: "claimCalendarSyncBatch" });

    return Response.json({ error: "No se pudo leer la cola" }, { status: 500 });
  }

  const rows = (data ?? []) as ClaimedRow[];

  if (rows.length === 0) {
    return Response.json({ processed: 0, failed: 0 });
  }

  /*
   * Un access token por profesional y por pasada. Sin esto se pediría uno nuevo
   * a Google por cada cita, y un día con veinte cambios serían veinte refrescos
   * para el mismo token que ya teníamos válido.
   */
  const accessTokens = new Map<string, string>();
  const revoked = new Set<string>();
  /*
   * Si el refresco falla por algo pasajero, se recuerda también: sin esto una
   * conexión rota pediría un token nuevo por cada fila del lote y castigaría a
   * Google cincuenta veces con la misma respuesta.
   */
  const refreshFailures = new Map<string, Error>();

  async function accessTokenFor(employeeId: string): Promise<string> {
    const cached = accessTokens.get(employeeId);

    if (cached) {
      return cached;
    }

    const previousFailure = refreshFailures.get(employeeId);

    if (previousFailure) {
      throw previousFailure;
    }

    const { data: refreshToken } = await admin.rpc(
      "google_calendar_refresh_token",
      { p_employee_id: employeeId },
    );

    if (!refreshToken) {
      throw new Error("La conexión no tiene refresh token");
    }

    try {
      const { accessToken } = await refreshAccessToken(refreshToken);
      accessTokens.set(employeeId, accessToken);

      return accessToken;
    } catch (cause) {
      const failure = cause instanceof Error ? cause : new Error(String(cause));
      refreshFailures.set(employeeId, failure);

      throw failure;
    }
  }

  let processed = 0;
  let failed = 0;

  for (const row of rows) {
    try {
      if (revoked.has(row.employee_id)) {
        continue;
      }

      if (!row.calendar_id || row.connection_status !== "active") {
        throw new Error("Sin conexión activa a la que sincronizar");
      }

      const accessToken = await accessTokenFor(row.employee_id);

      if (row.operation === "delete") {
        const eventId = row.payload.google_event_id ?? row.google_event_id;

        if (eventId) {
          await deleteEvent(accessToken, row.calendar_id, eventId);
        }

        await admin.rpc("complete_calendar_sync", { p_id: row.id });
        processed += 1;
        continue;
      }

      /*
       * Una cita que el profesional no ha aceptado —o que rechazó, canceló o no
       * se presentó— no pinta nada en su calendario. Si ya había evento se
       * retira; si no lo había, esto no hace nada y la fila se cierra igual.
       */
      if (!shouldSyncStatus(row.payload.status)) {
        if (row.google_event_id) {
          await deleteEvent(accessToken, row.calendar_id, row.google_event_id);
        }

        await admin.rpc("complete_calendar_sync", {
          p_id: row.id,
          p_removed: true,
        });
        processed += 1;
        continue;
      }

      const body = buildGoogleEvent(
        row.appointment_id,
        row.payload,
        row.clinic_name,
      );

      const event = row.google_event_id
        ? await patchEvent(
            accessToken,
            row.calendar_id,
            row.google_event_id,
            body,
          )
        : await insertEvent(accessToken, row.calendar_id, body);

      await admin.rpc("complete_calendar_sync", {
        p_id: row.id,
        p_google_event_id: event.id,
      });
      processed += 1;
    } catch (cause) {
      failed += 1;
      const message = cause instanceof Error ? cause.message : String(cause);

      if (isRevoked(cause)) {
        revoked.add(row.employee_id);
        await admin.rpc("mark_google_calendar_needs_reauth", {
          p_employee_id: row.employee_id,
          p_error: message,
        });
      }

      await admin.rpc("fail_calendar_sync", { p_id: row.id, p_error: message });

      /*
       * Se registra pero no se corta: una cita que falla no puede impedir que se
       * sincronicen las demás. La fila ya tiene su reintento programado.
       */
      logger.captureException(cause, {
        action: "calendarSyncRow",
        outboxId: row.id,
        attempts: row.attempts,
      });
    }
  }

  logger.info("[google-calendar] pasada de sincronización", {
    claimed: rows.length,
    processed,
    failed,
  });

  return Response.json({ processed, failed });
}
