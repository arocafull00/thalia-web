"use client";

import {
  Calendar,
  Clock,
  Euro,
  LayoutGrid,
  Package,
  Scissors,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";

import { useShellStore } from "@/stores/shell-store";

export type AppNavItem = {
  href: string;
  label: string;
  icon: ReactNode;
  visible: boolean;
  primaryMobile: boolean;
};

const BASE_NAV_ITEMS: Omit<AppNavItem, "visible" | "primaryMobile">[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: <LayoutGrid size={18} />,
  },
  {
    href: "/calendar",
    label: "Agenda",
    icon: <Calendar size={18} />,
  },
  {
    href: "/appointments",
    label: "Citas",
    icon: <Clock size={18} />,
  },
  {
    href: "/patients",
    label: "Pacientes",
    icon: <Users size={18} />,
  },
  {
    href: "/treatments",
    label: "Tratamientos",
    icon: <Scissors size={18} />,
  },
  {
    href: "/inventory",
    label: "Inventario",
    icon: <Package size={18} />,
  },
  {
    href: "/finances",
    label: "Finanzas",
    icon: <Euro size={18} />,
  },
  {
    href: "/employees",
    label: "Personal",
    icon: <UserPlus size={18} />,
  },
  {
    href: "/settings",
    label: "Ajustes",
    icon: <Settings size={18} />,
  },
];

const PRIMARY_MOBILE_HREFS = new Set([
  "/dashboard",
  "/calendar",
  "/patients",
  "/finances",
]);

export function useAppNavItems() {
  const showEmployees = useShellStore((state) => state.showEmployees);
  const showFinances = useShellStore((state) => state.showFinances);
  const showInventory = useShellStore((state) => state.showInventory);

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
    };
  });

  const visibleItems = items.filter((item) => item.visible);
  const primaryMobileItems = visibleItems.filter((item) => item.primaryMobile);
  const secondaryMobileItems = visibleItems.filter(
    (item) => !item.primaryMobile,
  );

  return {
    items: visibleItems,
    primaryMobileItems,
    secondaryMobileItems,
  };
}
