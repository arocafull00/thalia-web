import SettingsStatItem from "@/components/settings/components/settings-stat-item";
import { SETTINGS_COPY } from "@/copy/settings-copy";

type SettingsProfileSummaryProps = {
  activeEmployeesCount: number;
  canViewClinicRequests: boolean;
  isAdmin: boolean;
  pendingRequestsCount: number;
};

export default function SettingsProfileSummary({
  activeEmployeesCount,
  canViewClinicRequests,
  isAdmin,
  pendingRequestsCount,
}: SettingsProfileSummaryProps) {
  const statItems = [
    ...(isAdmin
      ? [
          {
            label: SETTINGS_COPY.stats.activeEmployees,
            tone: "default" as const,
            value: String(activeEmployeesCount),
          },
        ]
      : []),
    ...(canViewClinicRequests
      ? [
          {
            label: SETTINGS_COPY.stats.pendingRequests,
            tone:
              pendingRequestsCount > 0
                ? ("warning" as const)
                : ("default" as const),
            value: String(pendingRequestsCount),
          },
        ]
      : []),
  ];

  if (statItems.length === 0) {
    return null;
  }

  return (
    <div
      aria-label={SETTINGS_COPY.sections.stats}
      className="divide-y divide-border-subtle px-6 py-2"
    >
      {statItems.map((item) => (
        <SettingsStatItem
          key={item.label}
          label={item.label}
          tone={item.tone}
          value={item.value}
        />
      ))}
    </div>
  );
}
