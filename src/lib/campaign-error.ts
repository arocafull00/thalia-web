import { FunctionsHttpError } from "@supabase/supabase-js";

import { MARKETING_COPY } from "@/components/marketing/marketing-copy";
import { CAMPAIGN_LIMIT_ERROR_CODES } from "@/lib/campaign-limits";

type CampaignErrorBody = {
  code?: unknown;
  error?: unknown;
};

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export async function createCampaignError(cause: unknown): Promise<Error> {
  const error = cause instanceof Error ? cause : new Error(String(cause));
  const body =
    error instanceof FunctionsHttpError
      ? await error.context.json().catch(() => null)
      : null;
  const response =
    body && typeof body === "object" ? (body as CampaignErrorBody) : null;
  const candidates = [
    asString(response?.code),
    asString(response?.error),
    error.message,
  ].filter((value): value is string => Boolean(value));

  if (
    candidates.some((value) =>
      value.includes(CAMPAIGN_LIMIT_ERROR_CODES.sentLimitReached),
    )
  ) {
    return new Error(MARKETING_COPY.limits.sentLimitReached);
  }

  if (
    candidates.some((value) =>
      value.includes(CAMPAIGN_LIMIT_ERROR_CODES.recipientLimitExceeded),
    )
  ) {
    return new Error(MARKETING_COPY.limits.recipientLimitExceeded);
  }

  if (
    candidates.some((value) =>
      value.includes(CAMPAIGN_LIMIT_ERROR_CODES.sendInProgress),
    )
  ) {
    return new Error(MARKETING_COPY.limits.sendInProgress);
  }

  return error;
}
