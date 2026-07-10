"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarProfileFooter from "@/components/ui/sidebar-profile-footer";
import { useAppNavItems } from "@/lib/hooks/use-app-nav-items";

export default function AppSidebar() {
  const pathname = usePathname();
  const { items } = useAppNavItems();
  const { isMobile, setOpenMobile } = useSidebar();

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    setOpenMobile(false);
  }, [pathname, isMobile, setOpenMobile]);

  const closeMobileSidebar = () => {
    if (!isMobile) {
      return;
    }

    setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="offcanvas" className="border-border bg-canvas">
      <SidebarHeader className="px-2 py-3">
        <div className="flex items-center gap-3">
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
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  size="lg"
                  className={
                    active
                      ? "rounded-xl bg-primary text-on-primary hover:bg-primary hover:text-on-primary data-active:bg-primary data-active:text-on-primary"
                      : "rounded-xl text-ink-secondary hover:bg-primary-subtle/40 hover:text-ink-secondary"
                  }
                >
                  <Link href={item.href} onClick={closeMobileSidebar}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t border-border-subtle p-0">
        <SidebarProfileFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
