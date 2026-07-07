"use client";

import { Bell } from "lucide-react";

import AppSearchBar from "@/components/ui/app-search-bar";

export default function AppTopbar() {
  const notificationCount = 0;

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-4 border-b border-border-subtle bg-surface px-6">
      <div className="min-w-0 flex-1">
        <AppSearchBar />
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative rounded-full p-2 text-ink-secondary transition-colors hover:bg-primary-subtle hover:text-ink"
        >
          <Bell size={20} strokeWidth={1.75} />
          {notificationCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          ) : null}
        </button>
      </div>
    </header>
  );
}
