import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  tone: "primary" | "success" | "muted";
  title: string;
  body: string;
  children?: React.ReactNode;
};

const TONE_CLASSES: Record<Props["tone"], string> = {
  primary: "bg-primary-subtle text-primary",
  success: "bg-primary-subtle text-success",
  muted: "bg-canvas text-ink-muted",
};

export default function ConfirmationCard({
  icon: Icon,
  tone,
  title,
  body,
  children,
}: Props) {
  return (
    // Se abre casi siempre desde el navegador embebido de WhatsApp, en móvil:
    // una sola columna, sin nada que dependa del ancho de escritorio.
    <main className="flex min-h-dvh items-center justify-center bg-canvas p-4">
      <div className="w-full max-w-sm rounded-dialog bg-surface p-6 shadow-sm">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-card ${TONE_CLASSES[tone]}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>

        <h1 className="mt-4 text-xl font-medium text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-secondary">{body}</p>

        {children ? (
          <div className="mt-5 flex flex-col gap-4">{children}</div>
        ) : null}
      </div>
    </main>
  );
}
