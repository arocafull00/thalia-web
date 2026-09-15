"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { createBillingPortalSessionAction } from "@/components/billing/actions";
import { BILLING_COPY } from "@/copy/billing-copy";

export function useBillingPortal(clinicId: string | null) {
  const [isPending, startTransition] = useTransition();

  const openPortal = () => {
    if (!clinicId) {
      toast.error(BILLING_COPY.noActiveClinic);
      return;
    }

    startTransition(async () => {
      const result = await createBillingPortalSessionAction({ clinicId });

      if (!result.success) {
        toast.error(result.message || BILLING_COPY.portalError);
        return;
      }

      globalThis.location.assign(result.url);
    });
  };

  return { isPending, openPortal };
}
