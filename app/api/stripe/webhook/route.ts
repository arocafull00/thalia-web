import { logger } from "@/lib/logger";
import { getStripeClient, getStripeWebhookSecret } from "@/lib/stripe/server";
import { processStripeEvent } from "@/lib/stripe/webhook";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return Response.json({ error: "Falta Stripe-Signature" }, { status: 400 });
  }

  let event;

  try {
    const body = await request.text();
    event = getStripeClient().webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret(),
    );
  } catch (cause) {
    logger.captureException(cause, { action: "verifyStripeWebhook" });
    return Response.json({ error: "Firma no válida" }, { status: 400 });
  }

  try {
    await processStripeEvent(event);
    return Response.json({ received: true });
  } catch (cause) {
    logger.captureException(cause, {
      action: "processStripeWebhook",
      stripeEventId: event.id,
      stripeEventType: event.type,
    });
    return Response.json(
      { error: "No se pudo persistir el evento" },
      { status: 500 },
    );
  }
}
