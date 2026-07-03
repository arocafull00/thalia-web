import type { LucideIcon } from "lucide-react";

type EmployeeStatCardProps = {
  icon: LucideIcon;
  iconClassName: string;
  label: string;
  value: number;
};

export default function EmployeeStatCard({
  icon: Icon,
  iconClassName,
  label,
  value,
}: EmployeeStatCardProps) {
  return (
    <div className="flex flex-col gap-1 py-2">
      <Icon className={`size-4 shrink-0 ${iconClassName}`} aria-hidden="true" />
      <span className="text-lg font-semibold tabular-nums text-ink">
        {value}
      </span>
      <span className="text-xs text-ink-muted">{label}</span>
    </div>
  );
}
