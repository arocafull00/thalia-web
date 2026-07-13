import type { LucideIcon } from "lucide-react";

type PatientStatCardProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

export default function PatientStatCard({
  icon: Icon,
  label,
  value,
}: PatientStatCardProps) {
  return (
    <div className="rounded-card border border-border/60 bg-surface p-4">
      <div className="flex items-center gap-1.5 text-xs text-ink-muted">
        <Icon
          className="size-3.5 shrink-0"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <span className="truncate">{label}</span>
      </div>
      <p className="mt-2 truncate text-lg font-medium text-ink">{value}</p>
    </div>
  );
}
