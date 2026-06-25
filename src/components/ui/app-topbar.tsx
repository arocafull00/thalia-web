"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Search, Users } from "lucide-react";

import { useAuth } from "@/lib/hooks/use-auth";
import { useFileUrl } from "@/lib/hooks/use-file-url";
import { employeeRoleLabel } from "@/lib/format";
import { useTopbarSearchStore } from "@/stores/topbar-search-store";

function placeholderForPath(pathname: string) {
  if (pathname.startsWith("/calendar") || pathname.startsWith("/appointments")) {
    return "Buscar cita o paciente...";
  }

  if (pathname.startsWith("/patients")) {
    return "Buscar paciente...";
  }

  if (pathname.startsWith("/inventory")) {
    return "Buscar materiales o categorias...";
  }

  if (pathname.startsWith("/finances")) {
    return "Buscar movimientos o metricas...";
  }

  if (pathname.startsWith("/employees")) {
    return "Buscar personal...";
  }

  return "Buscar paciente o cita...";
}

export default function AppTopbar() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const avatarUrl = useFileUrl(profile?.avatar_url ?? null);
  const query = useTopbarSearchStore((state) => state.query);
  const setQuery = useTopbarSearchStore((state) => state.setQuery);
  const clearQuery = useTopbarSearchStore((state) => state.clearQuery);

  useEffect(() => {
    clearQuery();
  }, [pathname, clearQuery]);

  const profileSubtitle =
    profile?.specialty ?? (profile?.role ? employeeRoleLabel(profile.role) : "Perfil");

  return (
    <header className="flex min-h-[72px] items-center gap-4 border-b border-border bg-canvas px-8 py-3">
      <div className="relative w-[42%] min-w-[220px] max-w-[520px]">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholderForPath(pathname)}
          className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm outline-none ring-primary focus:ring-2"
        />
      </div>
      <div className="flex-1" />
      <Link
        href="/settings"
        className="flex max-w-[280px] items-center gap-3 rounded-xl border border-border bg-surface px-3 py-2 hover:bg-canvas"
      >
        <div className="min-w-0 flex-1 text-right">
          <p className="truncate text-sm font-medium text-ink">{profile?.full_name ?? "Perfil"}</p>
          <p className="truncate text-[11px] text-ink-muted">{profileSubtitle}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-border bg-primary-subtle/40">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <Users size={16} className="text-ink-muted" />
          )}
        </div>
      </Link>
    </header>
  );
}
