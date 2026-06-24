"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { useShellStore } from "@/stores/shell-store";

type NavItem = {
  href: string;
  label: string;
  icon: React.ReactNode;
  visible: boolean;
};

function SidebarItem({ href, label, icon, active }: NavItem & { active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
        active ? "bg-zinc-900 text-white" : "text-zinc-600 hover:bg-zinc-100"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function AppSidebar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const avatarUrl = useFileUrl(profile?.avatar_url ?? null);
  const showEmployees = useShellStore((state) => state.showEmployees);
  const showFinances = useShellStore((state) => state.showFinances);
  const showInventory = useShellStore((state) => state.showInventory);

  const items: NavItem[] = [
    { href: "/dashboard", label: "Inicio", icon: <LayoutGrid size={18} />, visible: true },
    { href: "/calendar", label: "Agenda", icon: <Calendar size={18} />, visible: true },
    { href: "/appointments", label: "Citas", icon: <Clock size={18} />, visible: true },
    { href: "/patients", label: "Pacientes", icon: <Users size={18} />, visible: true },
    { href: "/inventory", label: "Inventario", icon: <Package size={18} />, visible: showInventory },
    { href: "/finances", label: "Finanzas", icon: <Euro size={18} />, visible: showFinances },
    { href: "/employees", label: "Personal", icon: <UserPlus size={18} />, visible: showEmployees },
    { href: "/settings", label: "Ajustes", icon: <Settings size={18} />, visible: true },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex w-[280px] flex-col border-r border-zinc-200 bg-zinc-50 p-4">
      <div className="mb-8 pt-2">
        <p className="text-4xl font-medium text-zinc-900">Thalia</p>
        <p className="text-xs uppercase tracking-[0.2em] text-zinc-400">Aesthetic Excellence</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {items
          .filter((item) => item.visible)
          .map((item) => (
            <SidebarItem
              key={item.href}
              {...item}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
            />
          ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-2">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-100">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Users size={16} className="text-zinc-400" />
          )}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-900">{profile?.full_name ?? "Perfil"}</p>
          <p className="truncate text-[11px] uppercase text-zinc-400">{profile?.role ?? "Practitioner"}</p>
        </div>
      </div>
    </aside>
  );
}
