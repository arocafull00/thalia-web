"use client";

import Link from "next/link";

type SidebarItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  active: boolean;
};

export default function SidebarItem({
  href,
  label,
  icon,
  active,
}: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
        active
          ? "bg-primary text-on-primary"
          : "text-ink-secondary hover:bg-primary-subtle/40"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
