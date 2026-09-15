"use client";

import { useRouter } from "next/navigation";
import { useEffect, useTransition } from "react";
import { toast } from "sonner";

import {
  createBillingPortalSessionAction,
  createCheckoutSessionAction,
} from "@/components/billing/actions";
import { BILLING_COPY } from "@/copy/billing-copy";
import { useAuth } from "@/lib/hooks/use-auth";
import type { BillingStatus } from "@/types/database.types";

type UseSubscriptionPageInput = {
  clinicId: string;
  status: BillingStatus;
  checkoutResult: string | null;
};

export function useSubscriptionPage({
  clinicId,
  status,
  checkoutResult,
}: UseSubscriptionPageInput) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isPending, startTransition] = useTransition();
  const waitingForWebhook =
    checkoutResult === "success" &&
    status !== "trialing" &&
    status !== "active";

  useEffect(() => {
    if (checkoutResult === "cancelled") {
      toast.error(BILLING_COPY.checkoutCancelled);
    }
  }, [checkoutResult]);

  useEffect(() => {
    if (!waitingForWebhook) {
      return;
    }

    const interval = globalThis.setInterval(() => router.refresh(), 1500);
    const timeout = globalThis.setTimeout(
      () => globalThis.clearInterval(interval),
      30000,
    );

    return () => {
      globalThis.clearInterval(interval);
      globalThis.clearTimeout(timeout);
    };
  }, [router, waitingForWebhook]);

  const openCheckout = () => {
    startTransition(async () => {
      const result = await createCheckoutSessionAction({ clinicId });

      if (!result.success) {
        toast.error(result.message || BILLING_COPY.checkoutError);
        return;
      }

      globalThis.location.assign(result.url);
    });
  };

  const openPortal = () => {
    startTransition(async () => {
      const result = await createBillingPortalSessionAction({ clinicId });

      if (!result.success) {
        toast.error(result.message || BILLING_COPY.portalError);
        return;
      }

      globalThis.location.assign(result.url);
    });
  };

  return {
    isPending,
    openCheckout,
    openPortal,
    signOut,
    waitingForWebhook,
  };
}
