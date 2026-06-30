"use client";

import { Building2, Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { SIDEBAR_COPY } from "@/copy/sidebar-copy";
import type { ClinicMembershipView } from "@/stores/clinic-store";

type SidebarClinicSwitcherProps = {
  clinicName: string;
  memberships: ClinicMembershipView[];
  activeClinicId: string | null;
  onSelectClinic: (clinicId: string) => void;
};

export default function SidebarClinicSwitcher({
  clinicName,
  memberships,
  activeClinicId,
  onSelectClinic,
}: SidebarClinicSwitcherProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const canSwitch = memberships.length > 1;

  useEffect(() => {
    if (!open) {
      return;
    }

    const handler = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!canSwitch) {
    return (
      <p
        className="mt-0.5 flex min-w-0 items-center gap-1.5 truncate text-xs text-ink-muted"
        title={clinicName}
      >
        <Building2 size={12} className="shrink-0" />
        <span className="truncate">{clinicName}</span>
      </p>
    );
  }

  return (
    <div ref={dropdownRef} className="relative mt-0.5">
      <button
        type="button"
        aria-expanded={open}
        aria-label={SIDEBAR_COPY.switchClinic}
        onClick={() => setOpen((prev) => !prev)}
        className="flex min-w-0 max-w-full items-center gap-1.5 text-xs text-ink-muted hover:text-ink-secondary"
        title={clinicName}
      >
        <Building2 size={12} className="shrink-0" />
        <span className="truncate">{clinicName}</span>
        <ChevronDown size={12} className="shrink-0" />
      </button>
      {open ? (
        <div className="absolute bottom-full left-0 z-30 mb-1 min-w-[200px] rounded-xl border border-border bg-surface py-1 shadow-sm">
          {memberships.map((membership) => (
            <button
              key={membership.clinicId}
              type="button"
              onClick={() => {
                onSelectClinic(membership.clinicId);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-canvas"
            >
              <span className="flex-1 truncate text-ink">
                {membership.clinicName}
              </span>
              {membership.clinicId === activeClinicId ? (
                <Check size={14} className="shrink-0 text-primary" />
              ) : null}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
