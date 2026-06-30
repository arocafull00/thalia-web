"use client";

import {
  Calendar,
  Clock,
  Euro,
  LayoutGrid,
  Package,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

import SidebarItem from "@/components/ui/sidebar-item";
import SidebarProfileFooter from "@/components/ui/sidebar-profile-footer";
import { useShellStore } from "@/stores/shell-store";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  visible: boolean;
};

export default function AppSidebar() {
  const pathname = usePathname();
  const showEmployees = useShellStore((state) => state.showEmployees);
  const showFinances = useShellStore((state) => state.showFinances);
  const showInventory = useShellStore((state) => state.showInventory);

  const items: NavItem[] = [
    {
      href: "/dashboard",
      label: "Inicio",
      icon: <LayoutGrid size={18} />,
      visible: true,
    },
    {
      href: "/calendar",
      label: "Agenda",
      icon: <Calendar size={18} />,
      visible: true,
    },
    {
      href: "/appointments",
      label: "Citas",
      icon: <Clock size={18} />,
      visible: true,
    },
    {
      href: "/patients",
      label: "Pacientes",
      icon: <Users size={18} />,
      visible: true,
    },
    {
      href: "/inventory",
      label: "Inventario",
      icon: <Package size={18} />,
      visible: showInventory,
    },
    {
      href: "/finances",
      label: "Finanzas",
      icon: <Euro size={18} />,
      visible: showFinances,
    },
    {
      href: "/employees",
      label: "Personal",
      icon: <UserPlus size={18} />,
      visible: showEmployees,
    },
    {
      href: "/settings",
      label: "Ajustes",
      icon: <Settings size={18} />,
      visible: true,
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[280px] flex-col border-r border-border bg-canvas p-4">
      <div className="mb-8 pt-2">
        <p className="text-4xl font-medium text-ink">Thalia</p>
        <p className="text-xs uppercase tracking-[0.2em] text-ink-muted">
          Aesthetic Excellence
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items
          .filter((item) => item.visible)
          .map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              active={
                pathname === item.href || pathname.startsWith(`${item.href}/`)
              }
            />
          ))}
      </nav>
      <SidebarProfileFooter />
    </aside>
  );
}
