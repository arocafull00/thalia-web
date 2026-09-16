import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { unwrapSupabase, unwrapSupabaseNullable } from "@/lib/supabase-query";
import type {
  BillingStatus,
  ClinicBilling,
  ClinicBillingSummary,
} from "@/types/database.types";

export async function assertClinicOwner(userId: string, clinicId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinic_memberships")
    .select("id")
    .eq("user_id", userId)
    .eq("clinic_id", clinicId)
    .eq("role", "owner")
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    throw new Error("Solo el propietario puede gestionar la suscripción");
  }
}

export async function getClinicBillingRecord(
  clinicId: string,
): Promise<ClinicBilling | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("clinic_billing")
    .select("*")
    .eq("clinic_id", clinicId)
    .maybeSingle();

  return unwrapSupabaseNullable(data, error);
}

export async function getClinicBillingSummary(
  clinicId: string,
): Promise<ClinicBillingSummary | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("clinic_billing")
    .select(
      "clinic_id, billing_exempt, subscription_status, trial_ends_at, current_period_ends_at, cancel_at_period_end, updated_at",
    )
    .eq("clinic_id", clinicId)
    .maybeSingle();

  return unwrapSupabaseNullable(data, error);
}

export async function getClinicBillingIdentity(clinicId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("clinics")
    .select("id, name")
    .eq("id", clinicId)
    .single();

  return unwrapSupabase(data, error);
}

export async function saveStripeCustomer(clinicId: string, customerId: string) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("clinic_billing")
    .upsert(
      {
        clinic_id: clinicId,
        stripe_customer_id: customerId,
      },
      { onConflict: "clinic_id" },
    )
    .select("*")
    .single();

  return unwrapSupabase(data, error);
}

export async function findClinicBillingByStripeReferences(
  customerId: string | null,
  subscriptionId: string | null,
): Promise<ClinicBilling | null> {
  const supabase = createAdminClient();
  let query = supabase.from("clinic_billing").select("*");

  if (subscriptionId) {
    query = query.eq("stripe_subscription_id", subscriptionId);
  } else if (customerId) {
    query = query.eq("stripe_customer_id", customerId);
  } else {
    return null;
  }

  const { data, error } = await query.maybeSingle();
  return unwrapSupabaseNullable(data, error);
}

export type StripeBillingEventInput = {
  eventId: string;
  eventType: string;
  eventCreatedAt: string;
  clinicId: string;
  customerId: string | null;
  subscriptionId: string | null;
  status: BillingStatus;
  trialEndsAt: string | null;
  currentPeriodEndsAt: string | null;
  cancelAtPeriodEnd: boolean;
};

export async function applyStripeBillingEvent(
  input: StripeBillingEventInput,
): Promise<boolean> {
  const supabase = createAdminClient();
  const { data, error } = await supabase.rpc("apply_stripe_billing_event", {
    p_event_id: input.eventId,
    p_event_type: input.eventType,
    p_event_created_at: input.eventCreatedAt,
    p_clinic_id: input.clinicId,
    p_stripe_customer_id: input.customerId,
    p_stripe_subscription_id: input.subscriptionId,
    p_subscription_status: input.status,
    p_trial_ends_at: input.trialEndsAt,
    p_current_period_ends_at: input.currentPeriodEndsAt,
    p_cancel_at_period_end: input.cancelAtPeriodEnd,
  });

  return unwrapSupabase(data, error);
}
