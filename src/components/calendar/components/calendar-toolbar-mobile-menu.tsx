"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";

import AppDialog from "@/components/ui/app-dialog";
import AppSheetContent from "@/components/ui/app-sheet-content";
import { CALENDAR_COPY } from "@/copy/calendar-copy";
import type { CalendarViewMode } from "@/stores/calendar-store";

type CalendarToolbarMobileMenuProps = {
  viewMode: CalendarViewMode;
  onToday: () => void;
  onChangeViewMode: (mode: CalendarViewMode) => void;
};

export default function CalendarToolbarMobileMenu({
  viewMode,
  onToday,
  onChangeViewMode,
}: CalendarToolbarMobileMenuProps) {
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  const handleViewMode = (mode: CalendarViewMode) => {
    onChangeViewMode(mode);
    close();
  };

  const handleToday = () => {
    onToday();
    close();
  };

  return (
    <>
      <button
        type="button"
        aria-label={CALENDAR_COPY.toolbar.moreOptions}
        onClick={() => setOpen(true)}
        className="flex min-h-11 min-w-11 items-center justify-center rounded-full border border-border text-ink-secondary hover:bg-canvas md:hidden motion-reduce:transition-none"
      >
        <MoreHorizontal size={18} />
      </button>
      <AppDialog open={open} onOpenChange={setOpen}>
        <AppSheetContent
          showClose
          className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface p-0 shadow-lg outline-none data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"
        >
          <div className="border-b border-border-subtle px-6 py-4">
            <h2 className="text-lg font-medium text-ink">
              {CALENDAR_COPY.toolbar.moreOptions}
            </h2>
          </div>
          <div className="space-y-4 p-4 pb-safe-bottom">
            <div className="flex rounded-full border border-border bg-canvas p-0.5">
              <button
                type="button"
                onClick={() => handleViewMode("week")}
                className={`min-h-11 flex-1 rounded-full px-3 text-xs font-medium transition motion-reduce:transition-none ${
                  viewMode === "week"
                    ? "bg-primary text-on-primary"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {CALENDAR_COPY.toolbar.viewWeek}
              </button>
              <button
                type="button"
                onClick={() => handleViewMode("month")}
                className={`min-h-11 flex-1 rounded-full px-3 text-xs font-medium transition motion-reduce:transition-none ${
                  viewMode === "month"
                    ? "bg-primary text-on-primary"
                    : "text-ink-secondary hover:text-ink"
                }`}
              >
                {CALENDAR_COPY.toolbar.viewMonth}
              </button>
            </div>
            <button
              type="button"
              onClick={handleToday}
              className="flex min-h-11 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-ink-secondary hover:bg-canvas motion-reduce:transition-none"
            >
              {CALENDAR_COPY.toolbar.today}
            </button>
          </div>
        </AppSheetContent>
      </AppDialog>
    </>
  );
}
