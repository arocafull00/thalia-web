import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import {
  CAMPAIGN_LIMIT_ERROR_CODES,
  MAX_CAMPAIGN_RECIPIENTS,
  MAX_SENT_CAMPAIGNS,
} from "../_shared/campaign-limits.ts";
import { resolveWhatsAppMode, sendWhatsApp } from "../_shared/whatsapp.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Twilio limita los mensajes por segundo. Se envía en tandas pequeñas con una
// pausa entre ellas en lugar de disparar cientos de fetch a la vez.
const BATCH_SIZE = 10;
const BATCH_PAUSE_MS = 1000;

const IMAGE_URL_TTL_SECONDS = 60 * 60 * 24 * 7;

// WhatsApp sólo acepta JPEG y PNG como imagen adjunta. WebP está reservado a
// stickers, y enviarlo como adjunto normal devuelve 63021.
const SENDABLE_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png"];

function isSendableImageKey(key: string): boolean {
  const extension = key.split(".").pop()?.toLowerCase() ?? "";
  return SENDABLE_IMAGE_EXTENSIONS.includes(extension);
}

type SegmentPatient = {
  id: string;
  full_name: string;
  phone: string;
};

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function errorResponse(code: string, error: string, status: number): Response {
  return jsonResponse({ code, error }, status);
}

const CAMPAIGN_ERROR_MESSAGES = {
  sentLimitReached: `Has alcanzado el límite de ${MAX_SENT_CAMPAIGNS} campañas enviadas.`,
  recipientLimitExceeded: `El máximo por campaña es ${MAX_CAMPAIGN_RECIPIENTS} pacientes. Ajusta los filtros de destinatarios.`,
  sendInProgress: "Esta campaña ya se está enviando.",
} as const;

// Debe producir el mismo texto que campaign-message-preview.tsx en la app: son
// dos implementaciones porque Deno no puede importar del bundle de Next, así
// que cualquier cambio aquí hay que replicarlo allí.
function buildBody(campaign: {
  content: string;
  footer_text: string | null;
  footer_website: string | null;
  footer_phone: string | null;
}): string {
  const footer = [
    campaign.footer_text?.trim(),
    campaign.footer_website?.trim()
      ? `Web: ${campaign.footer_website.trim()}`
      : "",
    campaign.footer_phone?.trim()
      ? `Móvil: ${campaign.footer_phone.trim()}`
      : "",
  ]
    .filter((part): part is string => Boolean(part))
    .join(" · ");

  return footer ? `${campaign.content}\n\n${footer}` : campaign.content;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !anonKey || !serviceRoleKey) {
    return jsonResponse({ error: "Missing configuration" }, 500);
  }

  const authorization = req.headers.get("Authorization") ?? "";
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authorization } },
  });
  const { data: authData, error: authError } = await userClient.auth.getUser();

  if (authError || !authData.user) {
    return errorResponse("unauthorized", "Unauthorized", 401);
  }

  let campaignId: string | null = null;

  try {
    const body = await req.json();
    campaignId = body?.campaignId ?? null;
  } catch {
    campaignId = null;
  }

  if (!campaignId) {
    return jsonResponse({ error: "Falta campaignId." }, 400);
  }

  const mode = resolveWhatsAppMode();

  // El modo se registra lo primero: en mock todo devuelve éxito y no sale nada,
  // que es la causa más habitual de "no me llega el mensaje y no veo errores".
  console.log("[send-campaign] inicio", { campaignId, mode });

  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const { data: campaign, error: campaignError } = await supabase
    .from("campaigns")
    .select(
      "id, clinic_id, content, footer_text, footer_website, footer_phone, image_url, status, template_id",
    )
    .eq("id", campaignId)
    .maybeSingle();

  if (campaignError) {
    console.error("[send-campaign] error al leer la campaña", campaignError);
    return jsonResponse({ error: campaignError.message }, 500);
  }

  if (!campaign) {
    console.error("[send-campaign] campaña no encontrada", { campaignId });
    return jsonResponse({ error: "Campaña no encontrada." }, 404);
  }

  const [{ data: membership }, { data: employee }, { data: billing }] =
    await Promise.all([
      supabase
        .from("clinic_memberships")
        .select("id")
        .eq("clinic_id", campaign.clinic_id)
        .eq("user_id", authData.user.id)
        .eq("status", "active")
        .maybeSingle(),
      supabase
        .from("employees")
        .select("account_type, role")
        .eq("id", authData.user.id)
        .maybeSingle(),
      supabase
        .from("clinic_billing")
        .select("subscription_status")
        .eq("clinic_id", campaign.clinic_id)
        .maybeSingle(),
    ]);

  if (
    !membership ||
    employee?.account_type !== "internal" ||
    !["admin", "reception"].includes(employee.role) ||
    !billing ||
    !["trialing", "active"].includes(billing.subscription_status)
  ) {
    return errorResponse("forbidden", "Forbidden", 403);
  }

  // Reenviar una campaña ya enviada duplicaría mensajes reales: se rechaza en
  // vez de confiar solo en el índice único de destinatarios.
  if (campaign.status === "sending") {
    return errorResponse(
      CAMPAIGN_LIMIT_ERROR_CODES.sendInProgress,
      CAMPAIGN_ERROR_MESSAGES.sendInProgress,
      409,
    );
  }

  if (campaign.status === "sent" || campaign.status === "cancelled") {
    console.warn("[send-campaign] reenvío bloqueado", {
      campaignId,
      status: campaign.status,
    });
    return jsonResponse(
      { error: `La campaña está en estado ${campaign.status}.` },
      409,
    );
  }

  const { data: clinic, error: clinicError } = await supabase
    .from("clinics")
    .select("id, name, whatsapp_phone_number_id")
    .eq("id", campaign.clinic_id)
    .single();

  if (clinicError) {
    console.error("[send-campaign] error al leer la clínica", clinicError);
    return jsonResponse({ error: clinicError.message }, 500);
  }

  console.log("[send-campaign] clínica", {
    clinicId: clinic.id,
    from: clinic.whatsapp_phone_number_id ?? "(sin número)",
  });

  if (mode !== "mock" && !clinic.whatsapp_phone_number_id) {
    console.error("[send-campaign] la clínica no tiene número emisor", {
      clinicId: clinic.id,
    });
    return jsonResponse(
      { error: "La clínica no tiene número de WhatsApp configurado." },
      400,
    );
  }

  const { data: patients, error: patientsError } = await supabase.rpc(
    "campaign_patients_for_campaign",
    { p_campaign_id: campaignId },
  );

  if (patientsError) {
    console.error(
      "[send-campaign] error al resolver el segmento",
      patientsError,
    );
    return jsonResponse({ error: patientsError.message }, 500);
  }

  const recipients = (patients ?? []) as SegmentPatient[];

  console.log("[send-campaign] segmento resuelto", {
    total: recipients.length,
    telefonos: recipients.map((patient) => patient.phone),
  });

  if (recipients.length > MAX_CAMPAIGN_RECIPIENTS) {
    console.warn("[send-campaign] segmento por encima del límite", {
      campaignId,
      recipients: recipients.length,
      limit: MAX_CAMPAIGN_RECIPIENTS,
    });
    return errorResponse(
      CAMPAIGN_LIMIT_ERROR_CODES.recipientLimitExceeded,
      CAMPAIGN_ERROR_MESSAGES.recipientLimitExceeded,
      422,
    );
  }

  if (recipients.length === 0) {
    console.warn(
      "[send-campaign] el segmento no incluye a nadie: revisa marketing_opt_in y phone",
    );
    return jsonResponse({ sent: 0, failed: 0, skipped: 0, total: 0 });
  }

  // Se materializan los destinatarios antes de enviar. El índice único
  // (campaign_id, patient_id) hace que un reintento reutilice las filas ya
  // creadas en lugar de duplicarlas.
  const { error: upsertError } = await supabase
    .from("campaign_recipients")
    .upsert(
      recipients.map((patient) => ({
        campaign_id: campaignId,
        patient_id: patient.id,
        phone: patient.phone,
        status: "pending",
      })),
      { onConflict: "campaign_id,patient_id", ignoreDuplicates: true },
    );

  if (upsertError) {
    return jsonResponse({ error: upsertError.message }, 500);
  }

  // Solo se envía a quien sigue pendiente: si un intento anterior ya mandó
  // parte de la campaña, esos pacientes no reciben el mensaje dos veces.
  const { data: pending, error: pendingError } = await supabase
    .from("campaign_recipients")
    .select("id, patient_id, phone")
    .eq("campaign_id", campaignId)
    .eq("status", "pending");

  if (pendingError) {
    return jsonResponse({ error: pendingError.message }, 500);
  }

  const queue = pending ?? [];
  const skipped = recipients.length - queue.length;

  if (queue.length > MAX_CAMPAIGN_RECIPIENTS) {
    console.warn("[send-campaign] cola por encima del límite", {
      campaignId,
      pending: queue.length,
      limit: MAX_CAMPAIGN_RECIPIENTS,
    });
    return errorResponse(
      CAMPAIGN_LIMIT_ERROR_CODES.recipientLimitExceeded,
      CAMPAIGN_ERROR_MESSAGES.recipientLimitExceeded,
      422,
    );
  }

  console.log("[send-campaign] cola de envío", {
    pendientes: queue.length,
    saltados: skipped,
  });

  const { data: claimResult, error: claimError } = await supabase.rpc(
    "claim_campaign_send_slot",
    { p_campaign_id: campaignId },
  );

  if (claimError) {
    console.error("[send-campaign] no se pudo reservar el cupo", claimError);
    return jsonResponse({ error: claimError.message }, 500);
  }

  if (claimResult === CAMPAIGN_LIMIT_ERROR_CODES.sentLimitReached) {
    return errorResponse(
      CAMPAIGN_LIMIT_ERROR_CODES.sentLimitReached,
      CAMPAIGN_ERROR_MESSAGES.sentLimitReached,
      409,
    );
  }

  if (claimResult === CAMPAIGN_LIMIT_ERROR_CODES.sendInProgress) {
    return errorResponse(
      CAMPAIGN_LIMIT_ERROR_CODES.sendInProgress,
      CAMPAIGN_ERROR_MESSAGES.sendInProgress,
      409,
    );
  }

  if (claimResult !== "claimed") {
    return errorResponse(
      String(claimResult),
      "La campaña ya no se puede enviar.",
      claimResult === "campaign_not_found" ? 404 : 409,
    );
  }

  let processed = 0;

  try {
    let mediaUrl: string | null = null;

    if (campaign.image_url && isSendableImageKey(campaign.image_url)) {
      // El bucket es privado: Twilio necesita una URL firmada para descargarla.
      const { data: signed, error: signedError } = await supabase.storage
        .from("campaign-images")
        .createSignedUrl(campaign.image_url, IMAGE_URL_TTL_SECONDS);

      mediaUrl = signed?.signedUrl ?? null;

      if (signedError || !mediaUrl) {
        // Se sigue enviando sin imagen: perder el adjunto es mejor que perder
        // toda la campaña, pero conviene que quede constancia.
        console.warn("[send-campaign] no se pudo firmar la imagen", {
          key: campaign.image_url,
          error: signedError?.message,
        });
      }
    } else if (campaign.image_url) {
      // Campañas guardadas antes de que las imágenes se comprimieran a JPEG.
      // Se envía el texto sin adjunto en lugar de que Twilio tumbe la campaña
      // entera con «63021 Channel invalid content error».
      console.warn(
        "[send-campaign] formato de imagen no admitido por WhatsApp",
        {
          key: campaign.image_url,
          admitidos: SENDABLE_IMAGE_EXTENSIONS.join(", "),
        },
      );
    }

    const body = buildBody(campaign);
    let sent = 0;
    let failed = 0;

    for (let index = 0; index < queue.length; index += BATCH_SIZE) {
      const batch = queue.slice(index, index + BATCH_SIZE);

      const results = await Promise.all(
        batch.map(async (recipient) => {
          const result = await sendWhatsApp({
            from: clinic.whatsapp_phone_number_id ?? "mock",
            to: recipient.phone,
            body,
            mediaUrl,
            templateSid: campaign.template_id,
          });

          return { recipient, result };
        }),
      );

      processed += results.length;

      for (const { recipient, result } of results) {
        if (result.ok) {
          console.log("[send-campaign] enviado", {
            to: recipient.phone,
            providerMessageId: result.providerMessageId,
          });
        } else {
          console.error("[send-campaign] fallo de envío", {
            to: recipient.phone,
            error: result.error,
          });
        }

        const { error: recipientUpdateError } = await supabase
          .from("campaign_recipients")
          .update({
            status: result.ok ? "sent" : "failed",
            sent_at: result.ok ? new Date().toISOString() : null,
            error_message: result.error,
            provider_message_id: result.providerMessageId,
          })
          .eq("id", recipient.id);

        if (recipientUpdateError) {
          throw new Error(recipientUpdateError.message);
        }

        if (result.ok) {
          sent++;
        } else {
          failed++;
        }
      }

      if (index + BATCH_SIZE < queue.length) {
        await sleep(BATCH_PAUSE_MS);
      }
    }

    const { error: finishError } = await supabase
      .from("campaigns")
      .update({
        status: "sent",
        sent_at: new Date().toISOString(),
        send_started_at: null,
      })
      .eq("id", campaignId);

    if (finishError) {
      throw new Error(finishError.message);
    }

    console.log("[send-campaign] fin", {
      campaignId,
      mode,
      sent,
      failed,
      skipped,
      total: recipients.length,
    });

    return jsonResponse({
      sent,
      failed,
      skipped,
      total: recipients.length,
      mode,
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    const status = processed > 0 ? "sent" : "draft";
    const { error: recoveryError } = await supabase
      .from("campaigns")
      .update({
        status,
        sent_at: processed > 0 ? new Date().toISOString() : null,
        send_started_at: null,
      })
      .eq("id", campaignId);

    console.error("[send-campaign] envío abortado", {
      campaignId,
      processed,
      error: message,
      recoveryError: recoveryError?.message,
    });

    return jsonResponse({ error: message }, 500);
  }
});
