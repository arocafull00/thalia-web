type StatTone = "primary" | "danger" | "warning" | "success";

type StatProps = {
  label: string;
  value: string | number;
  tone?: StatTone;
};

const toneClasses: Record<StatTone, string> = {
  primary: "text-primary",
  danger: "text-danger",
  warning: "text-warning",
  success: "text-success",
};

export function Stat({ label, value, tone = "primary" }: StatProps) {
  return (
    <div className="flex w-full min-w-0 flex-1 flex-col items-center gap-1 px-4 first:pl-0 last:pr-0 lg:w-auto lg:flex-row lg:items-baseline lg:gap-2 lg:px-4 lg:first:pl-0">
      <p
        className={`text-xl font-medium tabular-nums lg:text-lg ${toneClasses[tone]}`}
      >
        {value}
      </p>
      <p className="text-xs text-ink-muted">{label}</p>
    </div>
  );
}
