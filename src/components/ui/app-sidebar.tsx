"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import AppSidebarNavItem from "@/components/ui/app-sidebar-nav-item";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
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
      <SidebarHeader className="border-b border-border-subtle px-4 py-4">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="Thalia"
            width={40}
            height={40}
            className="shrink-0 rounded-lg"
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-lg font-medium leading-none text-ink">Thalia</p>
            <p className="text-[10px] text-ink-muted">Aesthetic Excellence</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-3 py-4">
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <AppSidebarNavItem
                key={item.href}
                item={item}
                active={active}
                onNavigate={closeMobileSidebar}
              />
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
