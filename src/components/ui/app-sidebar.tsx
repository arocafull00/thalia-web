"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import AppSidebarNavSection from "@/components/ui/app-sidebar-nav-section";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarProfileFooter from "@/components/ui/sidebar-profile-footer";
import { useAppNavItems } from "@/lib/hooks/use-app-nav-items";

export default function AppSidebar() {
  const pathname = usePathname();
  const { sections } = useAppNavItems();
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
    <Sidebar collapsible="offcanvas" variant="floating" className="p-3.5">
      <SidebarHeader className="px-1.5 pb-5 pt-5">
        <div className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icon.png"
            alt="Thalia"
            width={52}
            height={52}
            className="size-13 shrink-0 rounded-card shadow-[inset_0_-5px_12px_color-mix(in_srgb,var(--primary)_14%,transparent)]"
          />
          <div className="flex flex-col gap-0.5">
            <p className="text-[18.5px] font-semibold leading-none tracking-[-0.01em] text-ink">
              Thalia
            </p>
            <p className="text-[8px] uppercase tracking-[0.15em] text-ink-muted">
              Aesthetic Excellence
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-1.5 px-1.5 pb-2">
        {sections.map((section) => (
          <AppSidebarNavSection
            key={section.id}
            section={section}
            pathname={pathname}
            onNavigate={closeMobileSidebar}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="mx-3.5 border-t border-border p-0">
        <SidebarProfileFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
