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
    <div className="flex min-w-0 flex-1 flex-col lg:flex-row lg:items-baseline lg:gap-1.5 w-full items-center gap-1 px-4 first:pl-0 last:pr-0 lg:w-auto lg:px-4 lg:first:pl-0">
      <p
        className={`text-2xl font-semibold tabular-nums lg:text-xl ${toneClasses[tone]}`}
      >
        {value}
      </p>
      <p className="text-sm text-ink-secondary">{label}</p>
    </div>
  );
}
