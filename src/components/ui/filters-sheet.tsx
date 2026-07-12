"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
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
          "max-h-[85dvh] gap-0 overflow-hidden rounded-t-[18px] border-border/60 bg-surface px-0 pb-0 pt-0 shadow-float",
          contentClassName,
        )}
      >
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="shrink-0 px-4 pt-2">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-base font-medium text-ink">Filtros</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={onDismiss}
                className="rounded-button"
              >
                <X size={18} strokeWidth={1.5} />
              </Button>
            </div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4">
            <div className="space-y-6">{children}</div>
          </div>
          <div className="mt-auto shrink-0 border-t border-border-subtle px-4 py-4 pb-8">
            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onClear}
              >
                Limpiar filtros
              </Button>
              <Button type="button" className="flex-1" onClick={onApply}>
                Aplicar filtros
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
