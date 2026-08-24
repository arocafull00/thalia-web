"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

import AppSidebarNavSection from "@/components/ui/app-sidebar-nav-section";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarProfileFooter from "@/components/ui/sidebar-profile-footer";
import { SIDEBAR_COPY } from "@/copy/sidebar-copy";
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

  // `icon` y no `offcanvas`: en escritorio el sidebar se reduce a la tira de
  // iconos en lugar de desaparecer, que es lo que da ancho a la ventana de
  // trabajo sin perder la navegación. En móvil el primitivo sigue abriéndolo
  // como panel, así que ahí no cambia nada.
  return (
    <Sidebar
      collapsible="icon"
      variant="floating"
      // El contenedor mide 2px más que el hueco reservado sólo en modo icono
      // (ver `sidebar.tsx`), así que se compensan aquí para que el canal de
      // 14px entre tarjetas siga siendo uniforme al colapsar.
      className="p-3.5 group-data-[collapsible=icon]:pr-4"
    >
      <SidebarHeader className="px-1.5 pb-5 pt-1">
        {/*
          Colapsado la fila pasa a columna: el ancho útil queda por debajo de
          los 52px del logo, así que no caben logo y botón en horizontal. El
          logo encoge a 28px y el botón se apila debajo.
        */}
        <div className="flex items-center justify-between gap-3 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:gap-2">
          <div className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:gap-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/icon.png"
              alt="Thalia"
              width={52}
              height={52}
              className="size-13 shrink-0 rounded-card shadow-[inset_0_-5px_12px_color-mix(in_srgb,var(--primary)_14%,transparent)] transition-[width,height] duration-[var(--sidebar-duration)] ease-[var(--sidebar-ease)] group-data-[collapsible=icon]:size-7"
            />
            <div className="flex min-w-0 flex-col gap-0.5 overflow-hidden transition-[opacity,width] duration-[var(--sidebar-duration)] ease-[var(--sidebar-ease)] group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0">
              <p className="whitespace-nowrap text-[18.5px] font-semibold leading-none tracking-[-0.01em] text-ink">
                Thalia
              </p>
              <p className="whitespace-nowrap text-[8px] uppercase tracking-[0.15em] text-ink-muted">
                Aesthetic Excellence
              </p>
            </div>
          </div>
          {/*
            `self-start` y los márgenes negativos lo llevan al vértice de la
            tarjeta en vez de dejarlo centrado contra los 52px del logo.
          */}
          <SidebarTrigger
            aria-label={SIDEBAR_COPY.toggle}
            className="-mr-1 -mt-0.5 hidden shrink-0 self-start rounded-button text-ink-muted hover:bg-(--hover-overlay) hover:text-ink md:inline-flex group-data-[collapsible=icon]:mr-0 group-data-[collapsible=icon]:self-center"
          />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col gap-1.5 px-1.5 pb-2 group-data-[collapsible=icon]:px-0">
        {sections.map((section, sectionIndex) => (
          <AppSidebarNavSection
            key={section.id}
            section={section}
            pathname={pathname}
            onNavigate={closeMobileSidebar}
            indexOffset={sections
              .slice(0, sectionIndex)
              .reduce((total, previous) => total + previous.items.length, 0)}
          />
        ))}
      </SidebarContent>
      <SidebarFooter className="mx-3.5 border-t border-border p-0 group-data-[collapsible=icon]:mx-1">
        <SidebarProfileFooter />
      </SidebarFooter>
    </Sidebar>
  );
}
