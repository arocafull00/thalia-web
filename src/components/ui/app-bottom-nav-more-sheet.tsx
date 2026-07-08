"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import AppDialog from "@/components/ui/app-dialog";
import AppSheetContent from "@/components/ui/app-sheet-content";
import SidebarProfileFooter from "@/components/ui/sidebar-profile-footer";
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
  const { items } = useAppNavItems();

  const close = () => onOpenChange(false);

  return (
    <AppDialog open={open} onOpenChange={onOpenChange}>
      <AppSheetContent
        showClose
        className="fixed inset-y-0 left-0 z-50 flex h-full w-full max-w-sm flex-col border-r border-border bg-surface p-0 shadow-lg outline-none data-[state=open]:animate-sheet-in-left data-[state=closed]:animate-sheet-out-left motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none"
      >
        <div className="border-b border-border-subtle px-4 py-5">
          <div className="flex items-center gap-3 pr-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Thalia"
              width={56}
              height={56}
              className="shrink-0 rounded-xl"
            />
            <div className="flex flex-col gap-0.5">
              <p className="text-2xl font-semibold leading-none text-ink">
                Thalia
              </p>
              <p className="text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                Aesthetic
                <br />
                Excellence
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="flex flex-col gap-1">
            {items.map((item) => {
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
