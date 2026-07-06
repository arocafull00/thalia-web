"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";

import AppBottomNavItem from "@/components/ui/app-bottom-nav-item";
import AppBottomNavMoreSheet from "@/components/ui/app-bottom-nav-more-sheet";
import { BOTTOM_NAV_COPY } from "@/copy/bottom-nav-copy";
import { useAppNavItems } from "@/lib/hooks/use-app-nav-items";

export default function AppBottomNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const { primaryMobileItems, moreIcon } = useAppNavItems();

  return (
    <>
      <nav
        aria-label={BOTTOM_NAV_COPY.ariaLabel}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-surface pb-safe-bottom lg:hidden"
      >
        <ul className="flex items-stretch justify-around">
          {primaryMobileItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <li key={item.href} className="flex-1">
                <AppBottomNavItem
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={active}
                />
              </li>
            );
          })}
          <li className="flex-1">
            <button
              type="button"
              aria-label={BOTTOM_NAV_COPY.more}
              aria-expanded={moreOpen}
              onClick={() => setMoreOpen(true)}
              className="flex min-h-14 w-full flex-col items-center justify-center gap-0.5 px-2 text-xs text-ink-secondary hover:text-ink motion-reduce:transition-none"
            >
              <span className="flex min-h-11 min-w-11 items-center justify-center">
                {moreIcon}
              </span>
              <span>{BOTTOM_NAV_COPY.more}</span>
            </button>
          </li>
        </ul>
      </nav>
      <AppBottomNavMoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
