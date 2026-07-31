import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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

function buildBody(campaign: {
  content: string;
  footer_text: string | null;
  footer_website: string | null;
  footer_phone: string | null;
}): string {
  const footer = [
    campaign.footer_text,
    campaign.footer_website,
    campaign.footer_phone,
  ]
    .map((part) => part?.trim() ?? "")
    .filter((part) => part.length > 0)
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
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ error: "Missing configuration" }, 500);
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

  // Reenviar una campaña ya enviada duplicaría mensajes reales: se rechaza en
  // vez de confiar solo en el índice único de destinatarios.
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

  console.log("[send-campaign] cola de envío", {
    pendientes: queue.length,
    saltados: skipped,
  });

  let mediaUrl: string | null = null;

  if (campaign.image_url) {
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

      await supabase
        .from("campaign_recipients")
        .update({
          status: result.ok ? "sent" : "failed",
          sent_at: result.ok ? new Date().toISOString() : null,
          error_message: result.error,
          provider_message_id: result.providerMessageId,
        })
        .eq("id", recipient.id);

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

  // La campaña se marca como enviada aunque haya fallos parciales: el detalle
  // por destinatario queda en campaign_recipients para poder reintentar.
  await supabase
    .from("campaigns")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", campaignId);

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
});
