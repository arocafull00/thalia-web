import { SETTINGS_COPY } from "@/copy/settings-copy";

type ClinicInfoRowProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null;
};

export default function ClinicInfoRow({
  icon: Icon,
  label,
  value,
}: ClinicInfoRowProps) {
  return (
    <div className="flex items-center gap-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary-subtle text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-ink-muted">{label}</p>
        <p className="truncate text-sm font-medium text-ink">
          {value ?? SETTINGS_COPY.clinic.noData}
        </p>
      </div>
    </div>
  );
}
