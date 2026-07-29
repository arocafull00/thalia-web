import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-input border border-border-field bg-surface px-3 py-2 text-base transition-colors outline-none placeholder:text-ink-muted focus-visible:border-primary focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-[var(--disabled-opacity)] aria-invalid:border-destructive md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
