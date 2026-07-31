"use client";

import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import AppSearchableCombobox from "@/components/ui/app-searchable-combobox";
import { clinicMembershipRoleLabel } from "@/lib/format";
import { useActiveClinic } from "@/lib/hooks/use-active-clinic";
import { resetClinicQueryData } from "@/stores/reset-clinic-query-data";

export default function TopbarClinicSelector() {
  const router = useRouter();
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

  if (clinicOptions.length === 0) {
    return null;
  }

  return (
    <AppSearchableCombobox
      value={membership?.clinicId ?? null}
      onValueChange={(value) => {
        if (!value) {
          return;
        }

        setActiveClinic(value);
        resetClinicQueryData();
        router.refresh();
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
      className="w-64 min-w-0 shrink-0"
    />
  );
}
