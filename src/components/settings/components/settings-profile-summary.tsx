import SettingsStatItem from "@/components/settings/components/settings-stat-item";
import { SETTINGS_COPY } from "@/copy/settings-copy";

type SettingsProfileSummaryProps = {
  canViewClinicRequests: boolean;
  pendingRequestsCount: number;
};

export default function SettingsProfileSummary({
  canViewClinicRequests,
  pendingRequestsCount,
}: SettingsProfileSummaryProps) {
  const statItems = [
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
    return (
      <section aria-labelledby="settings-summary-heading">
        <h2
          id="settings-summary-heading"
          className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
        >
          {SETTINGS_COPY.sections.stats}
        </h2>
        <p className="pt-4 text-sm text-ink-secondary">
          {SETTINGS_COPY.sections.statsEmpty}
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="settings-summary-heading">
      <h2
        id="settings-summary-heading"
        className="border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
      >
        {SETTINGS_COPY.sections.stats}
      </h2>
      <div
        aria-label={SETTINGS_COPY.sections.stats}
        className="divide-y divide-border-subtle pt-2"
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
    </section>
  );
}
