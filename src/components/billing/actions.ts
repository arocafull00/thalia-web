"use server";

import { createHash } from "node:crypto";

import {
  assertClinicOwner,
  getClinicBillingIdentity,
  getClinicBillingRecord,
  saveStripeCustomer,
} from "@/dal/billing.server.dal";
import { siteUrl } from "@/lib/environment";
import { logger } from "@/lib/logger";
import { clinicBillingActionSchema } from "@/lib/schemas/billing-schema";
import type { ClinicBillingActionInput } from "@/lib/schemas/billing-schema";
import { getStripeClient, getThaliaNormalPriceId } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import type { BillingRedirectResult } from "@/types/billing";

const INTEGRATION_ALPHABET = "abcdefghijklmnopqrstuvwxyz";

function createIntegrationIdentifier(seed: string): string {
  return Array.from(
    createHash("sha256").update(seed).digest().subarray(0, 8),
    (value) => INTEGRATION_ALPHABET.charAt(value % INTEGRATION_ALPHABET.length),
  ).join("");
}

async function requireOwner(input: ClinicBillingActionInput) {
  const parsed = clinicBillingActionSchema.safeParse(input);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Clínica no válida.");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;

  if (error || typeof userId !== "string") {
    throw new Error("Debes iniciar sesión para gestionar la suscripción.");
  }

  await assertClinicOwner(userId, parsed.data.clinicId);
  return {
    clinicId: parsed.data.clinicId,
    email: typeof data?.claims.email === "string" ? data.claims.email : null,
    userId,
  };
}

function actionError(cause: unknown, fallback: string): BillingRedirectResult {
  return {
    success: false,
    message: cause instanceof Error ? cause.message : fallback,
  };
}

export async function createCheckoutSessionAction(
  input: ClinicBillingActionInput,
): Promise<BillingRedirectResult> {
  let context: Awaited<ReturnType<typeof requireOwner>> | null = null;

  try {
    context = await requireOwner(input);

    if (!siteUrl) {
      throw new Error("NEXT_PUBLIC_SITE_URL no está configurada.");
    }

    const stripe = getStripeClient();
    const priceId = getThaliaNormalPriceId();
    const [clinic, billing] = await Promise.all([
      getClinicBillingIdentity(context.clinicId),
      getClinicBillingRecord(context.clinicId),
    ]);

    if (billing?.billing_exempt) {
      throw new Error("Esta clínica dispone de acceso gratuito.");
    }

    if (
      billing &&
      !["not_started", "canceled", "incomplete_expired"].includes(
        billing.subscription_status,
      )
    ) {
      throw new Error("Gestiona la suscripción existente desde el Portal.");
    }

    let customerId = billing?.stripe_customer_id ?? null;

    if (!customerId) {
      const customer = await stripe.customers.create(
        {
          email: context.email ?? undefined,
          name: clinic.name,
          metadata: { clinic_id: context.clinicId },
        },
        { idempotencyKey: `thalia-customer-${context.clinicId}` },
      );
      customerId = customer.id;
      await saveStripeCustomer(context.clinicId, customerId);
    } else if (context.email) {
      await stripe.customers.update(customerId, { email: context.email });
    }

    const session = await stripe.checkout.sessions.create(
      {
        mode: "subscription",
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        payment_method_collection: "if_required",
        automatic_tax: { enabled: true },
        billing_address_collection: "required",
        customer_update: { address: "auto", name: "auto" },
        name_collection: { business: { enabled: true, optional: false } },
        tax_id_collection: { enabled: true },
        subscription_data: {
          trial_period_days: 30,
          metadata: { clinic_id: context.clinicId },
          trial_settings: {
            end_behavior: { missing_payment_method: "pause" },
          },
        },
        client_reference_id: context.clinicId,
        metadata: { clinic_id: context.clinicId },
        locale: "es",
        success_url: `${siteUrl}/subscription?checkout=success`,
        cancel_url: `${siteUrl}/subscription?checkout=cancelled`,
        integration_identifier: `thalia_normal_${createIntegrationIdentifier(`${context.clinicId}:${priceId}`)}`,
      },
      { idempotencyKey: `thalia-checkout-${context.clinicId}-${priceId}` },
    );

    if (!session.url) {
      throw new Error("Stripe no devolvió una URL de Checkout.");
    }

    return { success: true, url: session.url };
  } catch (cause) {
    logger.captureException(cause, {
      action: "createStripeCheckoutSession",
      clinicId: context?.clinicId ?? null,
      userId: context?.userId,
    });
    return actionError(cause, "No se pudo abrir Stripe Checkout.");
  }
}

export async function createBillingPortalSessionAction(
  input: ClinicBillingActionInput,
): Promise<BillingRedirectResult> {
  let context: Awaited<ReturnType<typeof requireOwner>> | null = null;

  try {
    context = await requireOwner(input);

    if (!siteUrl) {
      throw new Error("NEXT_PUBLIC_SITE_URL no está configurada.");
    }

    const billing = await getClinicBillingRecord(context.clinicId);

    if (billing?.billing_exempt) {
      throw new Error("Esta clínica dispone de acceso gratuito.");
    }

    if (!billing?.stripe_customer_id) {
      throw new Error("La clínica todavía no tiene una cuenta de facturación.");
    }

    const session = await getStripeClient().billingPortal.sessions.create({
      customer: billing.stripe_customer_id,
      return_url: `${siteUrl}/subscription?portal=return`,
    });

    return { success: true, url: session.url };
  } catch (cause) {
    logger.captureException(cause, {
      action: "createStripeBillingPortalSession",
      clinicId: context?.clinicId ?? null,
      userId: context?.userId,
    });
    return actionError(cause, "No se pudo abrir el portal de facturación.");
  }
}
