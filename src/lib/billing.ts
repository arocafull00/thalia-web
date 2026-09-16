import type {
  BillingStatus,
  ClinicBillingSummary,
  EmployeeAccountType,
} from "@/types/database.types";

const BILLING_ACCESS_STATUSES = new Set<BillingStatus>(["trialing", "active"]);

export function createEmptyBillingSummary(
  clinicId: string,
): ClinicBillingSummary {
  return {
    clinic_id: clinicId,
    billing_exempt: false,
    subscription_status: "not_started",
    trial_ends_at: null,
    current_period_ends_at: null,
    cancel_at_period_end: false,
    updated_at: new Date(0).toISOString(),
  };
}

export function hasClinicBillingAccess(
  accountType: EmployeeAccountType | null,
  billing: Pick<ClinicBillingSummary, "billing_exempt" | "subscription_status">,
): boolean {
  return (
    accountType === "external" ||
    billing.billing_exempt ||
    BILLING_ACCESS_STATUSES.has(billing.subscription_status)
  );
}

export function normalizeBillingSummary(
  clinicId: string,
  value: ClinicBillingSummary | ClinicBillingSummary[] | null | undefined,
): ClinicBillingSummary {
  const summary = Array.isArray(value) ? value[0] : value;
  return summary ?? createEmptyBillingSummary(clinicId);
}
