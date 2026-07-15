"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { APPOINTMENT_STATUS_COPY } from "@/copy/appointment-status-copy";
import type { AppointmentStockIssue } from "@/lib/appointment-stock";

type AppointmentStockButtonProps = {
  issue: AppointmentStockIssue | null;
};

export default function AppointmentStockButton({
  issue,
}: AppointmentStockButtonProps) {
  if (!issue) {
    return null;
  }

  return (
    <Button asChild variant="destructive" size="xs">
      <Link
        href={`/inventory/${issue.inventoryItemId}`}
        aria-label={APPOINTMENT_STATUS_COPY.reviewStockLabel(issue)}
        onClick={(event) => event.stopPropagation()}
      >
        <AlertTriangle className="size-3.5" aria-hidden="true" />
        <span className="hidden sm:inline">
          {APPOINTMENT_STATUS_COPY.reviewStock}
        </span>
        <span className="sm:hidden">
          {APPOINTMENT_STATUS_COPY.stockShortLabel}
        </span>
        {issue.shortageCount > 1 ? (
          <span aria-hidden="true">({issue.shortageCount})</span>
        ) : null}
      </Link>
    </Button>
  );
}
