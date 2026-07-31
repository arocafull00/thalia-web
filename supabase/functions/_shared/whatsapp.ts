// Adapter de envío por WhatsApp compartido por send-reminders y send-campaign.
//
// El modo se controla con la variable de entorno WHATSAPP_MODE:
//
//   mock        No sale nada. Devuelve éxito y registra el payload. Para CI y
//               para probar el flujo completo sin gastar mensajes.
//   sandbox     Envío real por el sandbox de Twilio. Admite texto libre y
//               multimedia porque el destinatario abrió la ventana de 24h al
//               mandar "join <código>". Es el modo de la demo.
//   production  Exige una plantilla aprobada por Meta. WhatsApp no permite
//               texto libre en mensajes iniciados por el negocio fuera de esa
//               ventana, así que aquí el body se ignora y manda la plantilla.
//
// Por defecto es mock: si alguien despliega sin configurar nada, no se envía
// nada a nadie en lugar de mandar mensajes reales por accidente.

export type WhatsAppMode = "mock" | "sandbox" | "production";

export type WhatsAppMessage = {
  from: string;
  to: string;
  body: string;
  mediaUrl?: string | null;
  templateSid?: string | null;
  templateVariables?: Record<string, string> | null;
};

export type WhatsAppResult = {
  ok: boolean;
  providerMessageId: string | null;
  error: string | null;
};

const VALID_MODES: WhatsAppMode[] = ["mock", "sandbox", "production"];

export function resolveWhatsAppMode(): WhatsAppMode {
  const raw = (Deno.env.get("WHATSAPP_MODE") ?? "mock").trim().toLowerCase();
  return VALID_MODES.includes(raw as WhatsAppMode)
    ? (raw as WhatsAppMode)
    : "mock";
}

function withWhatsAppPrefix(value: string): string {
  return value.startsWith("whatsapp:") ? value : `whatsapp:${value}`;
}

async function postToTwilio(
  accountSid: string,
  authToken: string,
  body: URLSearchParams,
): Promise<WhatsAppResult> {
  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${accountSid}:${authToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: body.toString(),
      },
    );

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      // Twilio devuelve el motivo en el cuerpo; propagarlo evita tener que
      // adivinar por qué falló un envío mirando solo el código HTTP.
      const reason = payload?.message ?? `HTTP ${response.status}`;
      console.error("[whatsapp] Twilio rechazó el mensaje", {
        status: response.status,
        code: payload?.code ?? null,
        message: reason,
        // El código 63015/63016 suele ser sesión de sandbox caducada.
        moreInfo: payload?.more_info ?? null,
      });
      return { ok: false, providerMessageId: null, error: reason };
    }

    console.log("[whatsapp] Twilio aceptó el mensaje", {
      sid: payload?.sid ?? null,
      status: payload?.status ?? null,
    });

    return {
      ok: true,
      providerMessageId: payload?.sid ?? null,
      error: null,
    };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    console.error("[whatsapp] fallo de red al llamar a Twilio", { message });
    return { ok: false, providerMessageId: null, error: message };
  }
}

export async function sendWhatsApp(
  message: WhatsAppMessage,
): Promise<WhatsAppResult> {
  const mode = resolveWhatsAppMode();

  if (mode === "mock") {
    console.log("[whatsapp:mock]", {
      to: message.to,
      body: message.body.slice(0, 120),
      mediaUrl: message.mediaUrl ?? null,
      templateSid: message.templateSid ?? null,
    });
    return {
      ok: true,
      providerMessageId: `mock-${crypto.randomUUID()}`,
      error: null,
    };
  }

  const accountSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const authToken = Deno.env.get("TWILIO_AUTH_TOKEN");

  if (!accountSid || !authToken) {
    console.error("[whatsapp] faltan credenciales de Twilio", {
      tieneAccountSid: Boolean(accountSid),
      tieneAuthToken: Boolean(authToken),
    });
    return {
      ok: false,
      providerMessageId: null,
      error: "Faltan TWILIO_ACCOUNT_SID o TWILIO_AUTH_TOKEN.",
    };
  }

  console.log("[whatsapp] llamando a Twilio", {
    mode,
    from: message.from,
    to: message.to,
    conImagen: Boolean(message.mediaUrl),
  });

  const body = new URLSearchParams({
    From: withWhatsAppPrefix(message.from),
    To: withWhatsAppPrefix(message.to),
  });

  if (mode === "production") {
    // Fallar explícitamente en lugar de caer a texto libre: Meta rechazaría el
    // mensaje y el envío se perdería sin dejar rastro claro del motivo.
    if (!message.templateSid) {
      return {
        ok: false,
        providerMessageId: null,
        error:
          "WHATSAPP_MODE=production exige una plantilla aprobada (templateSid).",
      };
    }

    body.set("ContentSid", message.templateSid);

    if (message.templateVariables) {
      body.set("ContentVariables", JSON.stringify(message.templateVariables));
    }

    return postToTwilio(accountSid, authToken, body);
  }

  // sandbox: texto libre dentro de la ventana de 24h.
  body.set("Body", message.body);

  if (message.mediaUrl) {
    body.set("MediaUrl", message.mediaUrl);
  }

  return postToTwilio(accountSid, authToken, body);
}
