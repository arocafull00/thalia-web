"use client";

import { Bell, Building2, HelpCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { clinicMembershipRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";

export default function AppTopbar() {
  const notificationCount = 0;
  const [search, setSearch] = useState("");
  const { platformRole, memberships, membership, setActiveClinic } =
    useActiveClinic();

  const membershipRoleLabel = platformRole
    ? clinicMembershipRoleLabel(platformRole)
    : null;

  const clinicOptions = useMemo(
    () =>
      memberships.map((m) => ({
        value: m.clinicId,
        label:
          m.clinicName.length > 21
            ? `${m.clinicName.slice(0, 21)}…`
            : m.clinicName,
      })),
    [memberships],
  );

  return (
    <header className="sticky z-40 flex h-18 items-center gap-2 border-b border-border-subtle bg-topbar px-6">
      <SidebarTrigger
        variant="ghost"
        size="icon"
        className="rounded-full text-ink-secondary hover:bg-primary-subtle hover:text-ink lg:hidden"
      />
      {clinicOptions.length > 0 ? (
        <AppSearchableCombobox
          value={membership?.clinicId ?? null}
          onValueChange={(value) => {
            if (value) setActiveClinic(value);
          }}
          options={clinicOptions}
          showSearch={false}
          variant="pill"
          triggerLeading={<Building2 size={14} />}
          triggerTrailing={
            membershipRoleLabel ? (
              <span className="shrink-0 rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-medium text-success">
                {membershipRoleLabel}
              </span>
            ) : null
          }
          className="w-80 min-w-0"
        />
      ) : null}
      <div className="ml-auto flex items-center gap-2">
        <div className="flex items-center gap-1.5 rounded-full border border-border bg-canvas px-3 py-1.5 text-sm text-ink-muted focus-within:border-primary focus-within:ring-2 focus-within:ring-primary">
          <Search size={14} className="shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar…"
            className="w-40 bg-transparent outline-none placeholder:text-ink-muted"
          />
        </div>
        <button
          type="button"
          aria-label="Notificaciones"
          className="relative rounded-full p-2 text-ink-secondary transition-colors hover:bg-primary-subtle hover:text-ink"
        >
          <Bell size={20} strokeWidth={1.75} />
          {notificationCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
              {notificationCount > 99 ? "99+" : notificationCount}
            </span>
          ) : null}
        </button>
        <button
          type="button"
          aria-label="Ayuda"
          className="rounded-full p-2 text-ink-secondary transition-colors hover:bg-primary-subtle hover:text-ink"
        >
          <HelpCircle size={20} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
