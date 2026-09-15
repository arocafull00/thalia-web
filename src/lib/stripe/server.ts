import "server-only";

import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY no está configurada");
  }

  stripeClient ??= new Stripe(secretKey, {
    apiVersion: "2026-08-26.dahlia",
    appInfo: {
      name: "Thalia",
      version: "0.1.0",
    },
  });

  return stripeClient;
}

export function getStripeWebhookSecret(): string {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET no está configurada");
  }

  return webhookSecret;
}

export function getThaliaNormalPriceId(): string {
  const priceId = process.env.STRIPE_PRICE_THALIA_NORMAL;

  if (!priceId) {
    throw new Error("STRIPE_PRICE_THALIA_NORMAL no está configurada");
  }

  return priceId;
}
