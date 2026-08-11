import {
  AlertCircle,
  AlertTriangle,
  Info,
  type LucideIcon,
} from "lucide-react";

type NoticeProps = {
  message: string;
  tone?: "danger" | "warning" | "neutral";
};

const NOTICE_STYLES: Record<
  NonNullable<NoticeProps["tone"]>,
  {
    Icon: LucideIcon;
    root: string;
    icon: string;
  }
> = {
  danger: {
    Icon: AlertCircle,
    root: "border-danger/20 bg-danger-subtle",
    icon: "bg-danger/10 text-danger",
  },
  warning: {
    Icon: AlertTriangle,
    root: "border-warning/20 bg-warning-subtle",
    icon: "bg-warning/10 text-warning",
  },
  neutral: {
    Icon: Info,
    root: "border-border bg-surface-secondary",
    icon: "bg-surface text-ink-secondary",
  },
};

export function Notice({ message, tone = "neutral" }: NoticeProps) {
  const { Icon, root, icon } = NOTICE_STYLES[tone];
  const isDanger = tone === "danger";

  return (
    <div
      role={isDanger ? "alert" : "status"}
      aria-live={isDanger ? "assertive" : "polite"}
      className={`flex items-start gap-2.5 rounded-xl border px-3 py-2.5 ${root}`}
    >
      <span
        className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${icon}`}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <p className="min-w-0 self-center text-sm leading-5 text-ink text-pretty">
        {message}
      </p>
    </div>
  );
}
