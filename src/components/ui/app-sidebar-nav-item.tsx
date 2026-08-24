"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, type CSSProperties } from "react";

import AppSidebarNavPending from "@/components/ui/app-sidebar-nav-pending";
import AppSidebarNavSubmenu from "@/components/ui/app-sidebar-nav-submenu";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import type { AppNavItem } from "@/lib/hooks/use-app-nav-items";
import { cn } from "@/lib/utils";

type AppSidebarNavItemProps = {
  item: AppNavItem;
  active: boolean;
  pathname: string;
  onNavigate: () => void;
  /** Posición en el menú completo; marca su turno en la cascada al expandir. */
  index: number;
};

export default function AppSidebarNavItem({
  item,
  active,
  pathname,
  onNavigate,
  index,
}: AppSidebarNavItemProps) {
  const { state, setOpen } = useSidebar();
  const collapsed = state === "collapsed";
  const hasSubmenu = Boolean(item.subItems?.length);
  const [submenuOpenOverride, setSubmenuOpenOverride] = useState<
    boolean | null
  >(null);
  // Colapsado el submenú no cabe en la tira de iconos, así que no se pinta.
  const submenuOpen = !collapsed && (submenuOpenOverride ?? active);

  const handleSubmenuToggle = () => {
    // Pulsar un menú con submenú estando colapsado expande el sidebar en vez
    // de no hacer nada visible, que es lo que pasaría si sólo alternásemos un
    // desplegable que no se está pintando.
    if (collapsed) {
      setOpen(true);
      setSubmenuOpenOverride(true);
      return;
    }

    setSubmenuOpenOverride(!submenuOpen);
  };

  /*
   * El retardo vive en el estado expandido, no en el colapsado, porque una
   * transición usa las propiedades del estado al que va: así la cascada se ve
   * al abrir y al cerrar las etiquetas se van todas a la vez. Escalonar el
   * cierre las dejaría con ancho durante su espera y descentraría los iconos.
   */
  const staggerStyle = {
    "--label-delay": `calc(var(--sidebar-stagger) * ${index})`,
  } as CSSProperties;

  const labelClassName = cn(
    "overflow-hidden whitespace-nowrap transition-[opacity,width]",
    "duration-[var(--sidebar-duration)] ease-[var(--sidebar-ease)]",
    "[transition-delay:var(--label-delay)]",
    "group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0",
    "group-data-[collapsible=icon]:[transition-delay:0ms]",
  );

  const buttonClassName = cn(
    "h-9 rounded-button px-[11px] text-[14px] font-normal transition-colors",
    "[&_svg]:size-[18px] [&_svg]:stroke-[1.6]",
    // Colapsado, el primitivo deja la caja en 32px con 8px de padding, que
    // asume iconos de 16px. Los de aquí son de 18px, así que sobraban 8px a la
    // izquierda y 6px a la derecha. Centrar sin padding lo deja simétrico.
    // El `gap-0` es parte del centrado: la etiqueta se queda con ancho cero al
    // colapsar, pero el hueco entre hijos seguiría contando y desplazaría el
    // icono 4px a la izquierda.
    "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:p-0!",
    "text-ink-secondary hover:bg-(--hover-overlay) hover:text-primary-hover",
    "data-active:bg-[image:var(--gradient-primary)] data-active:font-medium data-active:text-on-primary data-active:shadow-nav-active data-active:hover:text-on-primary data-active:[&_svg]:text-on-primary",
  );

  if (hasSubmenu && item.subItems) {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton
          type="button"
          isActive={active}
          size="default"
          tooltip={item.label}
          aria-expanded={submenuOpen}
          className={buttonClassName}
          onClick={handleSubmenuToggle}
        >
          {item.icon}
          <span className={labelClassName} style={staggerStyle}>
            {item.label}
          </span>
          <ChevronRight
            aria-hidden="true"
            className={cn(
              "ml-auto transition-[transform,opacity,width] duration-[var(--sidebar-duration)] ease-[var(--sidebar-ease)]",
              "group-data-[collapsible=icon]:w-0 group-data-[collapsible=icon]:opacity-0",
              submenuOpen && "rotate-90",
            )}
          />
        </SidebarMenuButton>
        {submenuOpen ? (
          <AppSidebarNavSubmenu
            items={item.subItems}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ) : null}
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={active}
        size="default"
        tooltip={item.label}
        className={buttonClassName}
      >
        <Link
          href={item.href}
          onClick={onNavigate}
          className="flex items-center gap-3"
        >
          {item.icon}
          <span className={labelClassName} style={staggerStyle}>
            {item.label}
          </span>
          <AppSidebarNavPending />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
