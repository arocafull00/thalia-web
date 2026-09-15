import "server-only";

import type Stripe from "stripe";

import {
  applyStripeBillingEvent,
  findClinicBillingByStripeReferences,
} from "@/dal/billing.server.dal";
import { getStripeClient } from "@/lib/stripe/server";
import type { BillingStatus } from "@/types/database.types";

const SUBSCRIPTION_EVENTS = new Set([
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.paused",
  "customer.subscription.resumed",
  "customer.subscription.deleted",
  "customer.subscription.trial_will_end",
]);

function timestampToIso(timestamp: number | null): string | null {
  return timestamp ? new Date(timestamp * 1000).toISOString() : null;
}

function getReferenceId(
  value: string | { id: string } | null | undefined,
): string | null {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id;
}

function getCurrentPeriodEnd(subscription: Stripe.Subscription): string | null {
  const latestPeriodEnd = subscription.items.data.reduce<number | null>(
    (latest, item) =>
      latest === null || item.current_period_end > latest
        ? item.current_period_end
        : latest,
    null,
  );

  return timestampToIso(latestPeriodEnd);
}

function isBillingStatus(value: string): value is BillingStatus {
  return [
    "incomplete",
    "incomplete_expired",
    "trialing",
    "active",
    "past_due",
    "canceled",
    "unpaid",
    "paused",
  ].includes(value);
}

async function resolveClinicId(subscription: Stripe.Subscription) {
  const metadataClinicId = subscription.metadata.clinic_id;

  if (metadataClinicId) {
    return metadataClinicId;
  }

  const customerId = getReferenceId(subscription.customer);
  const billing = await findClinicBillingByStripeReferences(
    customerId,
    subscription.id,
  );
  return billing?.clinic_id ?? null;
}

async function applySubscription(
  event: Stripe.Event,
  subscription: Stripe.Subscription,
) {
  if (!isBillingStatus(subscription.status)) {
    throw new Error(
      `Estado de suscripción desconocido: ${subscription.status}`,
    );
  }

  const clinicId = await resolveClinicId(subscription);

  if (!clinicId) {
    throw new Error(`No se pudo resolver la clínica para ${subscription.id}`);
  }

  return applyStripeBillingEvent({
    eventId: event.id,
    eventType: event.type,
    eventCreatedAt: new Date(event.created * 1000).toISOString(),
    clinicId,
    customerId: getReferenceId(subscription.customer),
    subscriptionId: subscription.id,
    status: subscription.status,
    trialEndsAt: timestampToIso(subscription.trial_end),
    currentPeriodEndsAt: getCurrentPeriodEnd(subscription),
    cancelAtPeriodEnd: subscription.cancel_at_period_end,
  });
}

function getInvoiceSubscriptionId(invoice: Stripe.Invoice): string | null {
  const subscription = invoice.parent?.subscription_details?.subscription;
  return getReferenceId(subscription);
}

async function canonicalSubscription(
  subscriptionId: string,
): Promise<Stripe.Subscription> {
  return getStripeClient().subscriptions.retrieve(subscriptionId);
}

export async function processStripeEvent(event: Stripe.Event): Promise<void> {
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const subscriptionId = getReferenceId(session.subscription);

    if (!subscriptionId) {
      return;
    }

    await applySubscription(event, await canonicalSubscription(subscriptionId));
    return;
  }

  if (SUBSCRIPTION_EVENTS.has(event.type)) {
    const eventSubscription = event.data.object as Stripe.Subscription;
    const subscription = await canonicalSubscription(eventSubscription.id);
    await applySubscription(event, subscription);
    return;
  }

  if (
    event.type === "invoice.paid" ||
    event.type === "invoice.payment_failed"
  ) {
    const subscriptionId = getInvoiceSubscriptionId(event.data.object);

    if (!subscriptionId) {
      return;
    }

    await applySubscription(event, await canonicalSubscription(subscriptionId));
  }
}
