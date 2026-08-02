"use client";

import { Mail, Phone } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type ProfileIdentitySummaryProps = {
  name: string;
  badges?: ReactNode;
  specialty?: string | null;
  phone?: string | null;
  email?: string | null;
  centered?: boolean;
};

export function ProfileIdentitySummary({
  name,
  badges,
  specialty,
  phone,
  email,
  centered = false,
}: ProfileIdentitySummaryProps) {
  const trimmedPhone = phone?.trim();
  const trimmedEmail = email?.trim();
  const trimmedSpecialty = specialty?.trim();

  return (
    <div className={cn("min-w-0", centered && "text-center")}>
      <div
        className={cn(
          "flex flex-wrap items-center gap-2",
          centered && "justify-center",
        )}
      >
        <h1 className="truncate text-xl font-semibold tracking-tight text-ink">
          {name}
        </h1>
        {badges}
      </div>

      {trimmedSpecialty ? (
        <p className="mt-1 text-sm font-medium text-ink-secondary">
          {trimmedSpecialty}
        </p>
      ) : null}

      {trimmedPhone || trimmedEmail ? (
        <div
          className={cn(
            "mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-secondary",
            centered && "justify-center",
          )}
        >
          {trimmedPhone ? (
            <a
              href={`tel:${trimmedPhone}`}
              className="inline-flex items-center gap-1.5 transition hover:text-ink"
            >
              <Phone className="size-3.5 shrink-0" aria-hidden="true" />
              {trimmedPhone}
            </a>
          ) : null}

          {trimmedPhone && trimmedEmail ? (
            <span
              className="hidden size-1 rounded-full bg-border sm:block"
              aria-hidden="true"
            />
          ) : null}

          {trimmedEmail ? (
            <a
              href={`mailto:${trimmedEmail}`}
              className="inline-flex min-w-0 items-center gap-1.5 transition hover:text-ink"
            >
              <Mail className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="truncate">{trimmedEmail}</span>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
