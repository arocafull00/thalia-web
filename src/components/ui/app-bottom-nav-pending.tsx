"use client";

import { LoaderCircle } from "lucide-react";
import { useLinkStatus } from "next/link";

export default function AppBottomNavPending() {
  const { pending } = useLinkStatus();

  if (!pending) {
    return null;
  }

  return (
    <LoaderCircle
      aria-hidden="true"
      className="absolute right-2 top-1 size-3 animate-spin text-primary"
    />
  );
}
