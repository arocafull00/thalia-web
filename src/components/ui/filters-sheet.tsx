"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type FiltersSheetProps = {
  open: boolean;
  onDismiss: () => void;
  onApply: () => void;
  onClear: () => void;
  children: ReactNode;
  contentClassName?: string;
};

export default function FiltersSheet({
  open,
  onDismiss,
  onApply,
  onClear,
  children,
  contentClassName,
}: FiltersSheetProps) {
  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onDismiss();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="bottom"
        showCloseButton={false}
        className={cn(
          "max-h-[85dvh] gap-0 overflow-hidden rounded-t-2xl border-border bg-surface px-0 pb-0 pt-0",
          contentClassName,
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-4 pt-2">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-base font-semibold text-ink">Filtros</span>
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-full p-1.5 text-ink-muted hover:bg-canvas"
              >
                <X size={18} />
              </button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <div className="space-y-6">{children}</div>
          </div>
          <div className="mt-auto shrink-0 border-t border-border-subtle px-4 py-4 pb-8">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClear}
                className="flex-1 rounded-full border border-border px-4 py-2.5 text-sm font-medium text-ink-secondary hover:bg-canvas"
              >
                Limpiar filtros
              </button>
              <button
                type="button"
                onClick={onApply}
                className="flex-1 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-on-primary hover:bg-primary-hover"
              >
                Aplicar filtros
              </button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
