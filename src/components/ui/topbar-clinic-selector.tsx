"use client";

import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { TOPBAR_COPY } from "@/copy/topbar-copy";
import { clinicMembershipRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { resetClinicQueryData } from "@/stores/reset-clinic-query-data";

function formatClinicDisplayName(name: string): string {
  if (name.length <= 21) {
    return name;
  }

  return `${name.slice(0, 21)}…`;
}

export default function TopbarClinicSelector() {
  const router = useRouter();
  const { platformRole, memberships, membership, setActiveClinic } =
    useActiveClinic();
  const [pendingClinicId, setPendingClinicId] = useState<string | null>(null);

  const membershipRoleLabel = platformRole
    ? clinicMembershipRoleLabel(platformRole)
    : null;

  const clinicOptions = useMemo(
    () =>
      memberships.map((m) => ({
        value: m.clinicId,
        label: formatClinicDisplayName(m.clinicName),
      })),
    [memberships],
  );

  const canSwitch = memberships.length > 1;
  const clinicName =
    membership?.clinicName ?? memberships[0]?.clinicName ?? "";
  const isSwitching =
    pendingClinicId !== null && membership?.clinicId !== pendingClinicId;

  if (clinicOptions.length === 0) {
    return null;
  }

  if (!canSwitch) {
    return (
      <div
        aria-label={TOPBAR_COPY.activeClinic}
        className="control-chip flex w-64 min-w-0 shrink-0 items-center gap-2 rounded-button px-3 py-[9px] text-[13.5px]"
      >
        <Building2 size={14} className="shrink-0 text-ink-secondary" />
        <span className="min-w-0 flex-1 truncate text-ink" title={clinicName}>
          {formatClinicDisplayName(clinicName)}
        </span>
        {membershipRoleLabel ? (
          <span className="shrink-0 rounded-sm bg-primary-subtle px-[7px] py-0.5 text-[10.5px] font-medium text-primary-hover">
            {membershipRoleLabel}
          </span>
        ) : null}
      </div>
    );
  }

  return (
    <>
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {isSwitching ? TOPBAR_COPY.switchingClinic : null}
      </div>
      <AppSearchableCombobox
        value={membership?.clinicId ?? null}
        onValueChange={(value) => {
          if (!value || value === membership?.clinicId || isSwitching) {
            return;
          }

          setPendingClinicId(value);
          setActiveClinic(value);
          resetClinicQueryData();
          router.refresh();
        }}
        options={clinicOptions}
        showSearch={false}
        variant="pill"
        disabled={isSwitching}
        loading={isSwitching}
        ariaLabel={TOPBAR_COPY.switchClinic}
        triggerLeading={<Building2 size={14} />}
        triggerTrailing={
          membershipRoleLabel ? (
            <span className="shrink-0 rounded-sm bg-primary-subtle px-[7px] py-0.5 text-[10.5px] font-medium text-primary-hover">
              {membershipRoleLabel}
            </span>
          ) : null
        }
        className="control-chip w-64 min-w-0 shrink-0 rounded-button px-3 py-[9px] text-[13.5px]"
      />
    </>
  );
}
