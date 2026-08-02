"use client";

import {
  Calendar,
  Clock,
  Euro,
  FolderOpen,
  LayoutGrid,
  Megaphone,
  Package,
  Stethoscope,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import {
  APP_SIDEBAR_COPY,
  type AppNavSectionId,
} from "@/copy/app-sidebar-copy";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import {
  canManageClinicSettings,
  SETTINGS_SECTIONS,
} from "@/lib/settings-sections";
import { useShellStore } from "@/stores/shell-store";

export type AppNavSubItem = {
  href: string;
  label: string;
};

export type AppNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  section: AppNavSectionId;
  visible: boolean;
  primaryMobile: boolean;
  subItems?: AppNavSubItem[];
};

export type AppNavSection = {
  id: AppNavSectionId;
  label: string;
  items: AppNavItem[];
};

const NAV_SECTION_ORDER: AppNavSectionId[] = [
  "general",
  "clinic",
  "business",
  "configuration",
];

const BASE_NAV_ITEMS: Array<Omit<AppNavItem, "visible" | "primaryMobile">> = [
  {
    href: "/dashboard",
    label: "Inicio",
    icon: <LayoutGrid size={18} strokeWidth={1.5} />,
    section: "general",
  },
  {
    href: "/calendar",
    label: "Agenda",
    icon: <Calendar size={18} strokeWidth={1.5} />,
    section: "clinic",
  },
  {
    href: "/appointments",
    label: "Citas",
    icon: <Clock size={18} strokeWidth={1.5} />,
    section: "clinic",
  },
  {
    href: "/patients",
    label: "Pacientes",
    icon: <Users size={18} strokeWidth={1.5} />,
    section: "clinic",
  },
  {
    href: "/treatments",
    label: "Tratamientos",
    icon: <Stethoscope size={18} strokeWidth={1.5} />,
    section: "clinic",
  },
  {
    href: "/files",
    label: "Archivos",
    icon: <FolderOpen size={18} strokeWidth={1.5} />,
    section: "business",
  },
  {
    href: "/inventory",
    label: "Inventario",
    icon: <Package size={18} strokeWidth={1.5} />,
    section: "business",
  },
  {
    href: "/finances",
    label: "Finanzas",
    icon: <Euro size={18} strokeWidth={1.5} />,
    section: "business",
  },
  {
    href: "/marketing",
    label: "Marketing",
    icon: <Megaphone size={18} strokeWidth={1.5} />,
    section: "business",
  },
  {
    href: "/employees",
    label: "Personal",
    icon: <UserPlus size={18} strokeWidth={1.5} />,
    section: "business",
  },
  {
    href: "/settings",
    label: "Ajustes",
    icon: <Settings size={18} strokeWidth={1.5} />,
    section: "configuration",
    subItems: SETTINGS_SECTIONS.map((section) => ({
      href: section.href,
      label: SETTINGS_COPY.nav[section.id],
    })),
  },
];

const PRIMARY_MOBILE_HREFS = new Set([
  "/dashboard",
  "/calendar",
  "/patients",
  "/finances",
]);

export function useAppNavItems() {
  const { platformRole } = useActiveClinic();
  const showEmployees = useShellStore((state) => state.showEmployees);
  const showFinances = useShellStore((state) => state.showFinances);
  const showInventory = useShellStore((state) => state.showInventory);
  const canManageClinic = canManageClinicSettings(platformRole);

  const items: AppNavItem[] = BASE_NAV_ITEMS.map((item) => {
    let visible = true;

    if (item.href === "/employees") {
      visible = showEmployees;
    }

    if (item.href === "/finances") {
      visible = showFinances;
    }

    if (item.href === "/inventory") {
      visible = showInventory;
    }

    return {
      ...item,
      visible,
      primaryMobile: PRIMARY_MOBILE_HREFS.has(item.href) && visible,
      subItems: item.subItems?.filter(
        (subItem) => subItem.href !== "/settings/clinica" || canManageClinic,
      ),
    };
  });

  const visibleItems = items.filter((item) => item.visible);
  const primaryMobileItems = visibleItems.filter((item) => item.primaryMobile);
  const secondaryMobileItems = visibleItems.filter(
    (item) => !item.primaryMobile,
  );
  const sections: AppNavSection[] = NAV_SECTION_ORDER.map((id) => ({
    id,
    label: APP_SIDEBAR_COPY.sections[id],
    items: visibleItems.filter((item) => item.section === id),
  })).filter((section) => section.items.length > 0);

  return {
    items: visibleItems,
    sections,
    primaryMobileItems,
    secondaryMobileItems,
  };
}
