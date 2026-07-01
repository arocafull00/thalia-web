type EmployeeStatCardProps = {
  label: string;
  value: number;
};

export default function EmployeeStatCard({
  label,
  value,
}: EmployeeStatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink">{value}</p>
    </div>
  );
}
