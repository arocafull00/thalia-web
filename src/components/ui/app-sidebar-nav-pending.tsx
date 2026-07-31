"use client";

import { LoaderCircle } from "lucide-react";
import { useLinkStatus } from "next/link";

export default function AppSidebarNavPending() {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <LoaderCircle
      aria-hidden="true"
      className="ml-auto animate-spin text-primary-light"
    />
  );
}
