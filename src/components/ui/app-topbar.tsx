"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Building2, Check, ChevronDown, Search, ShieldCheck } from "lucide-react";

import { clinicMembershipRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
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
  const query = useTopbarSearchStore((state) => state.query);
  const setQuery = useTopbarSearchStore((state) => state.setQuery);
  const clearQuery = useTopbarSearchStore((state) => state.clearQuery);
  const { clinicName, platformRole, memberships, setActiveClinic, membership } = useActiveClinic();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    clearQuery();
  }, [pathname, clearQuery]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

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
      {clinicName ? (
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-widest text-ink-muted">Clínica</span>
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-sm hover:bg-canvas"
              >
                <Building2 size={14} className="shrink-0 text-ink-muted" />
                <span className="font-medium text-ink">{clinicName}</span>
                {memberships.length > 1 ? <ChevronDown size={14} className="text-ink-muted" /> : null}
              </button>
              {open && memberships.length > 1 ? (
                <div className="absolute right-0 top-full z-30 mt-1 min-w-[200px] rounded-xl border border-border bg-surface py-1 shadow-sm">
                  {memberships.map((m) => (
                    <button
                      key={m.clinicId}
                      onClick={() => { setActiveClinic(m.clinicId); setOpen(false); }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-canvas"
                    >
                      <span className="flex-1 text-ink">{m.clinicName}</span>
                      {m.clinicId === membership?.clinicId ? <Check size={14} className="text-primary" /> : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          {platformRole ? (
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-widest text-ink-muted">Rol</span>
              <span className="flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3 py-2 text-sm shadow-sm">
                <ShieldCheck size={14} className="shrink-0 text-ink-muted" />
                <span className="font-medium text-ink">{clinicMembershipRoleLabel(platformRole)}</span>
              </span>
            </div>
          ) : null}
        </div>
      ) : null}
    </header>
  );
}
