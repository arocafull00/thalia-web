"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";

type SettingsActionRowProps = {
  description: string;
  disabled?: boolean;
  href?: string;
  icon: LucideIcon;
  iconClassName: string;
  loading?: boolean;
  loadingLabel: string;
  onClick?: () => void;
  title: string;
  titleClassName?: string;
};

export default function SettingsActionRow({
  description,
  disabled,
  href,
  icon: Icon,
  iconClassName,
  loading,
  loadingLabel,
  onClick,
  title,
  titleClassName = "text-ink",
}: SettingsActionRowProps) {
  const label = loading ? loadingLabel : title;
  const content = (
    <>
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className={`text-sm font-medium ${titleClassName}`}>{label}</p>
        <p className="text-xs text-ink-muted">{description}</p>
      </div>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-ink-muted"
        aria-hidden="true"
      />
    </>
  );

  const className =
    "group flex w-full items-center gap-3 px-5 py-4 text-left transition-colors hover:bg-canvas disabled:opacity-50";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {content}
    </button>
  );
}
