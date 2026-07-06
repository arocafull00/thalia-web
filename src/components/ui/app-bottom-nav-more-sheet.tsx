"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import AppDialog from "@/components/ui/app-dialog";
import AppSheetContent from "@/components/ui/app-sheet-content";
import SidebarProfileFooter from "@/components/ui/sidebar-profile-footer";
import { BOTTOM_NAV_COPY } from "@/copy/bottom-nav-copy";
import { useAppNavItems } from "@/lib/hooks/use-app-nav-items";

type AppBottomNavMoreSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AppBottomNavMoreSheet({
  open,
  onOpenChange,
}: AppBottomNavMoreSheetProps) {
  const pathname = usePathname();
  const { secondaryMobileItems } = useAppNavItems();

  const close = () => onOpenChange(false);

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppSheetContent
        showClose
        className="fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-border bg-surface p-0 shadow-lg outline-none data-[state=open]:animate-sheet-in data-[state=closed]:animate-sheet-out motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"
      >
        <div className="border-b border-border-subtle px-6 py-4">
          <h2 className="text-lg font-medium text-ink">
            {BOTTOM_NAV_COPY.more}
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col gap-1">
            {secondaryMobileItems.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={close}
                    aria-current={active ? "page" : undefined}
                    className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm transition motion-reduce:transition-none ${
                      active
                        ? "bg-primary text-on-primary"
                        : "text-ink-secondary hover:bg-primary-subtle/40"
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="border-t border-border-subtle pb-safe-bottom">
          <SidebarProfileFooter />
        </div>
      </AppSheetContent>
    </AppDialog>
  );
}
