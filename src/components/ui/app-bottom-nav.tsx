"use client";

import { usePathname } from "next/navigation";

import AppBottomNavItem from "@/components/ui/app-bottom-nav-item";
import { BOTTOM_NAV_COPY } from "@/copy/bottom-nav-copy";
import { useAppNavItems } from "@/lib/hooks/use-app-nav-items";

export default function AppBottomNav() {
  const pathname = usePathname();
  const { primaryMobileItems } = useAppNavItems();

  return (
    <nav
      aria-label={BOTTOM_NAV_COPY.ariaLabel}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-canvas pb-safe-bottom lg:hidden"
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
      </ul>
    </nav>
  );
}
