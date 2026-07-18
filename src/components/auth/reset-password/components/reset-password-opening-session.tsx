import { Loader2 } from "lucide-react";

import { LOGIN_COPY } from "@/copy/login-copy";

export default function ResetPasswordOpeningSession() {
  return (
    <div className="flex items-center justify-center gap-3 rounded-xl border border-border bg-primary-subtle px-4 py-3.5">
      <Loader2 className="size-5 shrink-0 animate-spin text-primary" />
      <p className="text-sm text-ink">
        {LOGIN_COPY.resetPassword.openingSession}
      </p>
    </div>
  );
}
