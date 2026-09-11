"use client";

import { useEffect } from "react";

import { getRecoveryLinkDestination } from "@/lib/auth/recovery-link-route";

export default function RecoveryLinkRouter() {
  useEffect(() => {
    const destination = getRecoveryLinkDestination(
      new URL(globalThis.location.href),
    );

    if (destination) {
      globalThis.location.replace(destination);
    }
  }, []);

  return null;
}
