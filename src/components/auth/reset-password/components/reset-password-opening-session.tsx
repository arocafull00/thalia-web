import { Loader2 } from "lucide-react";

type ResetPasswordOpeningSessionProps = {
  message: string;
};

export default function ResetPasswordOpeningSession({
  message,
}: ResetPasswordOpeningSessionProps) {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-primary-subtle px-4 py-3.5">
      <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
      <p className="text-sm text-ink">{message}</p>
    </div>
  );
}
