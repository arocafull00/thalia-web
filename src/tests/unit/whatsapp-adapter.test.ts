import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  resolveWhatsAppMode,
  sendWhatsApp,
} from "../../../supabase/functions/_shared/whatsapp";

const TWILIO_URL_FRAGMENT = "api.twilio.com";

function stubEnv(values: Record<string, string>) {
  vi.stubGlobal("Deno", {
    env: { get: (key: string) => values[key] },
  });
}

function stubFetchOk(sid = "SM123") {
  const fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    status: 201,
    json: async () => ({ sid }),
  });
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function bodyOf(fetchMock: ReturnType<typeof vi.fn>): URLSearchParams {
  return new URLSearchParams(fetchMock.mock.calls[0][1].body as string);
}

const baseMessage = {
  from: "+34600000000",
  to: "+34610000010",
  body: "Hola, tenemos una promoción.",
};

describe("resolveWhatsAppMode", () => {
  it("por defecto es mock, para no enviar nada sin configurar", () => {
    stubEnv({});
    expect(resolveWhatsAppMode()).toBe("mock");
  });

  it("un valor desconocido cae a mock en vez de enviar", () => {
    stubEnv({ WHATSAPP_MODE: "produccion-de-verdad" });
    expect(resolveWhatsAppMode()).toBe("mock");
  });

  it("ignora mayúsculas y espacios", () => {
    stubEnv({ WHATSAPP_MODE: "  SANDBOX  " });
    expect(resolveWhatsAppMode()).toBe("sandbox");
  });
});

describe("sendWhatsApp en modo mock", () => {
  beforeEach(() => {
    stubEnv({ WHATSAPP_MODE: "mock" });
  });

  it("no llama a Twilio y devuelve un id simulado", async () => {
    const fetchMock = stubFetchOk();
    const result = await sendWhatsApp(baseMessage);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.ok).toBe(true);
    expect(result.providerMessageId).toMatch(/^mock-/);
  });
});

describe("sendWhatsApp en modo sandbox", () => {
  it("falla con un motivo claro si faltan credenciales", async () => {
    stubEnv({ WHATSAPP_MODE: "sandbox" });
    const fetchMock = stubFetchOk();
    const result = await sendWhatsApp(baseMessage);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/TWILIO/);
  });

  it("envía texto libre y prefija los números con whatsapp:", async () => {
    stubEnv({
      WHATSAPP_MODE: "sandbox",
      TWILIO_ACCOUNT_SID: "AC1",
      TWILIO_AUTH_TOKEN: "tok",
    });
    const fetchMock = stubFetchOk("SM999");
    const result = await sendWhatsApp(baseMessage);

    expect(fetchMock.mock.calls[0][0]).toContain(TWILIO_URL_FRAGMENT);
    const body = bodyOf(fetchMock);
    expect(body.get("From")).toBe("whatsapp:+34600000000");
    expect(body.get("To")).toBe("whatsapp:+34610000010");
    expect(body.get("Body")).toBe(baseMessage.body);
    expect(result.providerMessageId).toBe("SM999");
  });

  it("no vuelve a prefijar un número que ya trae whatsapp:", async () => {
    stubEnv({
      WHATSAPP_MODE: "sandbox",
      TWILIO_ACCOUNT_SID: "AC1",
      TWILIO_AUTH_TOKEN: "tok",
    });
    const fetchMock = stubFetchOk();
    await sendWhatsApp({ ...baseMessage, from: "whatsapp:+34600000000" });

    expect(bodyOf(fetchMock).get("From")).toBe("whatsapp:+34600000000");
  });

  it("adjunta la imagen cuando hay mediaUrl", async () => {
    stubEnv({
      WHATSAPP_MODE: "sandbox",
      TWILIO_ACCOUNT_SID: "AC1",
      TWILIO_AUTH_TOKEN: "tok",
    });
    const fetchMock = stubFetchOk();
    await sendWhatsApp({ ...baseMessage, mediaUrl: "https://x.test/a.png" });

    expect(bodyOf(fetchMock).get("MediaUrl")).toBe("https://x.test/a.png");
  });

  it("propaga el motivo que devuelve Twilio, no un error genérico", async () => {
    stubEnv({
      WHATSAPP_MODE: "sandbox",
      TWILIO_ACCOUNT_SID: "AC1",
      TWILIO_AUTH_TOKEN: "tok",
    });
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ message: "Twilio: número no válido" }),
      }),
    );

    const result = await sendWhatsApp(baseMessage);

    expect(result.ok).toBe(false);
    expect(result.error).toBe("Twilio: número no válido");
  });

  it("no revienta si la red falla", async () => {
    stubEnv({
      WHATSAPP_MODE: "sandbox",
      TWILIO_ACCOUNT_SID: "AC1",
      TWILIO_AUTH_TOKEN: "tok",
    });
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("ECONNRESET")));

    const result = await sendWhatsApp(baseMessage);

    expect(result.ok).toBe(false);
    expect(result.error).toBe("ECONNRESET");
  });
});

describe("sendWhatsApp en modo production", () => {
  beforeEach(() => {
    stubEnv({
      WHATSAPP_MODE: "production",
      TWILIO_ACCOUNT_SID: "AC1",
      TWILIO_AUTH_TOKEN: "tok",
    });
  });

  it("sin plantilla falla en vez de mandar texto libre que Meta rechazaría", async () => {
    const fetchMock = stubFetchOk();
    const result = await sendWhatsApp(baseMessage);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/plantilla/i);
  });

  it("con plantilla manda ContentSid y omite el body libre", async () => {
    const fetchMock = stubFetchOk();
    await sendWhatsApp({
      ...baseMessage,
      templateSid: "HX123",
      templateVariables: { "1": "Marta" },
    });

    const body = bodyOf(fetchMock);
    expect(body.get("ContentSid")).toBe("HX123");
    expect(body.get("ContentVariables")).toBe('{"1":"Marta"}');
    expect(body.get("Body")).toBeNull();
  });
});
