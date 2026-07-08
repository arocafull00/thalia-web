"use client";

import { Bell, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { TREATMENTS_COPY } from "@/components/treatments/treatments-copy";
import AppBottomNavMoreSheet from "@/components/ui/app-bottom-nav-more-sheet";
import { APPOINTMENTS_COPY } from "@/copy/appointments-copy";
import { BOTTOM_NAV_COPY } from "@/copy/bottom-nav-copy";
import { EMPLOYEES_COPY } from "@/copy/employees-copy";
import { FINANCES_COPY } from "@/copy/finances-copy";
import { INVENTORY_COPY } from "@/copy/inventory-copy";
import { PATIENTS_COPY } from "@/copy/patients-copy";
import { SETTINGS_COPY } from "@/copy/settings-copy";

const PAGE_TITLES_BY_ROUTE: Record<string, string> = {
  "/appointments": APPOINTMENTS_COPY.page.title,
  "/employees": EMPLOYEES_COPY.page.title,
  "/finances": FINANCES_COPY.title,
  "/inventory": INVENTORY_COPY.page.title,
  "/patients": PATIENTS_COPY.page.title,
  "/settings": SETTINGS_COPY.page.title,
  "/treatments": TREATMENTS_COPY.page.title,
};

export default function AppTopbar() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const notificationCount = 0;
  const title = PAGE_TITLES_BY_ROUTE[pathname];

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 items-center gap-2 border-b border-border-subtle bg-surface px-6">
        <button
          type="button"
          aria-label={BOTTOM_NAV_COPY.menu}
          aria-expanded={moreOpen}
          onClick={() => setMoreOpen(true)}
          className="rounded-full p-2 text-ink-secondary transition-colors hover:bg-primary-subtle hover:text-ink lg:hidden"
        >
          <Menu size={20} strokeWidth={1.75} />
        </button>
        {title ? (
          <h1 className="truncate text-base font-medium text-ink">{title}</h1>
        ) : null}
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative ml-auto rounded-full p-2 text-ink-secondary transition-colors hover:bg-primary-subtle hover:text-ink"
        >
          <Bell size={20} strokeWidth={1.75} />
          {notificationCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          ) : null}
        </button>
      </header>
      <AppBottomNavMoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
