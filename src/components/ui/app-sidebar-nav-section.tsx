"use client";

import AppSidebarNavItem from "@/components/ui/app-sidebar-nav-item";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { AppNavSection } from "@/lib/hooks/use-app-nav-items";
import { cn } from "@/lib/utils";

type AppSidebarNavSectionProps = {
  section: AppNavSection;
  pathname: string;
  onNavigate: () => void;
  /**
   * Cuántos ítems hay por encima de esta sección. La cascada al expandir tiene
   * que recorrer el menú entero de arriba abajo, así que el índice no puede
   * reiniciarse en cada sección.
   */
  indexOffset: number;
};

export default function AppSidebarNavSection({
  section,
  pathname,
  onNavigate,
  indexOffset,
}: AppSidebarNavSectionProps) {
  if (section.items.length === 0) {
    return null;
  }

  return (
    <SidebarGroup className="p-0">
      <SidebarGroupLabel
        className={cn(
          "h-auto px-2.5 pb-1.5 pt-3.5 text-[9.5px] font-medium uppercase tracking-[0.17em] text-ink-muted",
          // Colapsado el primitivo lo desvanece con `opacity-0` y lo sube con
          // `-mt-8`, pero un elemento transparente sigue capturando clics: se
          // quedaba por encima del último ítem de la sección anterior y lo
          // volvía inaccesible.
          "group-data-[collapsible=icon]:pointer-events-none",
        )}
      >
        {section.label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        {/* Colapsado los botones miden 32px en una tarjeta de 36: sin centrar la
            lista quedarían pegados al borde izquierdo. */}
        <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center">
          {section.items.map((item, index) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <AppSidebarNavItem
                key={item.href}
                item={item}
                active={active}
                pathname={pathname}
                onNavigate={onNavigate}
                index={indexOffset + index}
              />
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
