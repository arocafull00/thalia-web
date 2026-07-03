"use client";

import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

import { useFileUrl } from "@/lib/hooks/use-file-url";

export type ProfileContactItem = {
  icon: LucideIcon;
  value: string;
  href?: string;
};

type ProfileHeaderProps = {
  avatarUrl?: string | null;
  initials: string;
  name: string;
  avatarColor?: string;
  badges?: ReactNode;
  contactItems?: ProfileContactItem[];
  actions?: ReactNode;
};

function getAvatarStyle(avatarColor?: string): CSSProperties | undefined {
  if (!avatarColor) {
    return undefined;
  }

  return {
    backgroundColor: avatarColor,
    boxShadow: `0 0 0 2px var(--surface), 0 0 0 4px ${avatarColor}`,
  };
}

export function ProfileHeader({
  avatarUrl,
  initials,
  name,
  avatarColor,
  badges,
  contactItems = [],
  actions,
}: ProfileHeaderProps) {
  const resolvedAvatarUrl = useFileUrl(avatarUrl ?? null);
  const avatarStyle = getAvatarStyle(avatarColor);
  const hasCustomColor = Boolean(avatarColor);

  return (
    <header className="border-b border-border bg-surface px-8 py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div
            className={`flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full ${
              hasCustomColor
                ? "text-on-primary"
                : "bg-primary-subtle text-primary ring-2 ring-border ring-offset-2"
            }`}
            style={avatarStyle}
          >
            {resolvedAvatarUrl ? (
              <Image
                src={resolvedAvatarUrl}
                alt=""
                width={96}
                height={96}
                unoptimized
                className="size-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold">{initials}</span>
            )}
          </div>

          <div className="min-w-0 space-y-3 text-center sm:text-left">
            <div className="space-y-2">
              <h1 className="text-3xl font-semibold text-ink text-wrap-balance">
                {name}
              </h1>
              {badges ? (
                <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
                  {badges}
                </div>
              ) : null}
            </div>

            {contactItems.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 sm:justify-start">
                {contactItems.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <>
                      <Icon
                        className="size-4 shrink-0 text-ink-muted"
                        aria-hidden="true"
                      />
                      <span>{item.value}</span>
                    </>
                  );

                  if (item.href) {
                    return (
                      <a
                        key={`${item.href}-${item.value}`}
                        href={item.href}
                        className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink"
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <span
                      key={item.value}
                      className="inline-flex items-center gap-1.5 text-sm text-ink-secondary"
                    >
                      {content}
                    </span>
                  );
                })}
              </div>
            ) : null}
          </div>
        </div>

        {actions ? (
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start lg:justify-end">
            {actions}
          </div>
        ) : null}
      </div>
    </header>
  );
}

export function getProfileInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0]!.slice(0, 2).toUpperCase();
  }

  return `${parts[0]![0] ?? ""}${parts[parts.length - 1]![0] ?? ""}`.toUpperCase();
}
