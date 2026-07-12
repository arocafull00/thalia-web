import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import AppointmentPersonAvatar from "@/components/appointments/components/appointment-person-avatar";

type AppointmentHeaderPersonProps = {
  label: string;
  name: string;
  href: string | null;
  avatarUrl: string | null;
  fallbackClassName?: string;
  fallbackStyle?: CSSProperties;
  trailing?: ReactNode;
  secondary?: ReactNode;
};

export default function AppointmentHeaderPerson({
  label,
  name,
  href,
  avatarUrl,
  fallbackClassName,
  fallbackStyle,
  trailing,
  secondary,
}: AppointmentHeaderPersonProps) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
        {label}
      </p>
      <div className="mt-2 flex items-start gap-3">
        <AppointmentPersonAvatar
          name={name}
          avatarUrl={avatarUrl}
          fallbackClassName={fallbackClassName}
          fallbackStyle={fallbackStyle}
        />
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            {href ? (
              <Link
                href={href}
                className="text-lg font-semibold text-ink hover:text-primary"
              >
                {name}
              </Link>
            ) : (
              <p className="text-lg font-semibold text-ink">{name}</p>
            )}
            {trailing}
          </div>
          {secondary}
        </div>
      </div>
    </div>
  );
}
