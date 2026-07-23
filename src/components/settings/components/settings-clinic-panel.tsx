"use client";

import { Building2, MapPin, Phone, Stethoscope, Users } from "lucide-react";

import ClinicInfoRow from "@/components/settings/components/clinic-info-row";
import SettingsClinicHoursPanel from "@/components/settings/components/settings-clinic-hours-panel";
import SettingsWhatsAppPanel from "@/components/settings/components/settings-whatsapp-panel";
import { SETTINGS_COPY } from "@/copy/settings-copy";
import type { ClinicInfo } from "@/lib/hooks/use-clinic-info";

type SettingsClinicPanelProps = {
  clinic: ClinicInfo | null;
  loading: boolean;
  activeEmployeesCount: number;
};

export default function SettingsClinicPanel({
  clinic,
  loading,
  activeEmployeesCount,
}: SettingsClinicPanelProps) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        <section aria-labelledby="settings-clinic-heading">
          <h2
            id="settings-clinic-heading"
            className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
          >
            {SETTINGS_COPY.clinic.sectionTitle}
          </h2>
          {loading ? (
            <div className="mt-4 h-40 animate-pulse rounded-xl bg-surface" />
          ) : (
            <>
              <div className="divide-y divide-border-subtle">
                <ClinicInfoRow
                  icon={Building2}
                  label={SETTINGS_COPY.clinic.name}
                  value={clinic?.name ?? null}
                />
                <ClinicInfoRow
                  icon={Phone}
                  label={SETTINGS_COPY.clinic.phone}
                  value={clinic?.phone ?? null}
                />
                <ClinicInfoRow
                  icon={MapPin}
                  label={SETTINGS_COPY.clinic.address}
                  value={clinic?.address ?? null}
                />
                <ClinicInfoRow
                  icon={Stethoscope}
                  label={SETTINGS_COPY.clinic.specialty}
                  value={clinic?.specialty ?? null}
                />
              </div>
              <hr className="border-border-subtle" />
              <ClinicInfoRow
                icon={Users}
                label={SETTINGS_COPY.stats.activeEmployees}
                value={String(activeEmployeesCount)}
              />
            </>
          )}
        </section>
        <SettingsClinicHoursPanel clinic={clinic} />
      </div>

      <SettingsWhatsAppPanel />
    </div>
  );
}
