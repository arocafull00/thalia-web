"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import {
  createBillingPortalSessionAction,
  createCheckoutSessionAction,
} from "@/components/billing/actions";
import { BILLING_COPY } from "@/copy/billing-copy";
import { hasClinicBillingAccess } from "@/lib/billing";
import { useAuth } from "@/lib/hooks/use-auth";
import { hasPendingTeamInvites } from "@/lib/registration-metadata";
import { useClinicStore } from "@/stores/clinic-store";
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
  const { profile, signOut, user } = useAuth();
  const fetchMemberships = useClinicStore((state) => state.fetchMemberships);
  const [isPending, startTransition] = useTransition();
  const [webhookTimedOut, setWebhookTimedOut] = useState(false);
  const [pollAttempt, setPollAttempt] = useState(0);
  const waitingForWebhook =
    checkoutResult === "success" &&
    status !== "trialing" &&
    status !== "active";

  useEffect(() => {
    if (checkoutResult === "cancelled") {
      toast.error(BILLING_COPY.checkoutCancelled);
    }
  }, [checkoutResult]);

  const retryWebhookPoll = useCallback(() => {
    setWebhookTimedOut(false);
    setPollAttempt((attempt) => attempt + 1);
  }, []);

  useEffect(() => {
    if (!waitingForWebhook || !user || webhookTimedOut) {
      return;
    }

    let cancelled = false;
    let timeout: ReturnType<typeof globalThis.setTimeout> | undefined;
    const deadline = Date.now() + 30000;

    const pollBillingAccess = async () => {
      const memberships = await fetchMemberships(user.id);

      if (cancelled) {
        return;
      }

      const membership = memberships.find((item) => item.clinicId === clinicId);

      if (
        membership &&
        hasClinicBillingAccess(
          profile?.account_type ?? null,
          membership.billing,
        )
      ) {
        cancelled = true;
        router.replace(
          hasPendingTeamInvites(user) ? "/invite-team" : "/dashboard",
        );
        return;
      }

      if (Date.now() >= deadline) {
        setWebhookTimedOut(true);
        return;
      }

      timeout = globalThis.setTimeout(() => void pollBillingAccess(), 1500);
    };

    void pollBillingAccess();

    return () => {
      cancelled = true;

      if (timeout) {
        globalThis.clearTimeout(timeout);
      }
    };
  }, [
    clinicId,
    fetchMemberships,
    pollAttempt,
    profile?.account_type,
    router,
    user,
    waitingForWebhook,
    webhookTimedOut,
  ]);

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

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await signOut();
        router.replace("/login");
      } catch {
        toast.error(BILLING_COPY.signOutError);
      }
    });
  };

  return {
    isPending,
    openCheckout,
    openPortal,
    retryWebhookPoll,
    signOut: handleSignOut,
    waitingForWebhook,
    webhookTimedOut,
  };
}
