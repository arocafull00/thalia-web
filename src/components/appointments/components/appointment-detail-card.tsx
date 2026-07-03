import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type AppointmentDetailCardProps = {
  icon: LucideIcon;
  title: string;
  ariaLabel?: string;
  children: ReactNode;
};

export default function AppointmentDetailCard({
  icon: Icon,
  title,
  ariaLabel,
  children,
}: AppointmentDetailCardProps) {
  return (
    <section
      aria-label={ariaLabel ?? title}
      className="rounded-2xl border border-border bg-surface p-5"
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-ink-muted" aria-hidden="true" />
        <h2 className="text-xs uppercase tracking-wide text-ink-muted">
          {title}
        </h2>
      </div>
      <div className="mt-4">{children}</div>
    </section>
  );
}
