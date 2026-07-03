import ProfileTimelineItemRow, {
  type ProfileTimelineItem,
} from "@/components/ui/profile/profile-timeline-item";

export type { ProfileTimelineItem };

type ProfileTimelineProps = {
  items: ProfileTimelineItem[];
  emptyMessage: string;
  headingId: string;
  heading: string;
  variant?: "card" | "integrated";
};

function groupItemsByMonth(items: ProfileTimelineItem[]) {
  const groups: { monthGroup: string; items: ProfileTimelineItem[] }[] = [];
  const indexByMonth = new Map<string, number>();

  for (const item of items) {
    const existingIndex = indexByMonth.get(item.monthGroup);

    if (existingIndex === undefined) {
      indexByMonth.set(item.monthGroup, groups.length);
      groups.push({ monthGroup: item.monthGroup, items: [item] });
      continue;
    }

    groups[existingIndex]!.items.push(item);
  }

  return groups;
}

export function ProfileTimeline({
  items,
  emptyMessage,
  headingId,
  heading,
  variant = "card",
}: ProfileTimelineProps) {
  const isIntegrated = variant === "integrated";
  const headingClassName = isIntegrated
    ? "shrink-0 border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance"
    : "mb-4 text-lg font-medium text-ink text-wrap-balance";
  const sectionClassName = isIntegrated
    ? "flex min-h-0 flex-1 flex-col"
    : undefined;

  if (items.length === 0) {
    return (
      <section aria-labelledby={headingId} className={sectionClassName}>
        <h2 id={headingId} className={headingClassName}>
          {heading}
        </h2>
        {isIntegrated ? (
          <p className="py-8 text-sm text-ink-secondary">{emptyMessage}</p>
        ) : (
          <div className="rounded-2xl border border-dashed border-border p-10 text-center text-ink-secondary">
            {emptyMessage}
          </div>
        )}
      </section>
    );
  }

  const groups = groupItemsByMonth(items);

  return (
    <section aria-labelledby={headingId} className={sectionClassName}>
      <h2 id={headingId} className={headingClassName}>
        {heading}
      </h2>
      <div
        className={
          isIntegrated
            ? "min-h-0 flex-1 space-y-8 pt-6"
            : "rounded-2xl border border-border bg-surface p-5"
        }
      >
        <div className="space-y-8">
          {groups.map((group) => (
            <div key={group.monthGroup}>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-ink-muted">
                {group.monthGroup}
              </p>
              <div className="relative pl-4">
                <div
                  className="absolute top-2 bottom-2 left-[5px] w-px bg-border-subtle"
                  aria-hidden="true"
                />
                <ul className="space-y-0">
                  {group.items.map((item) => (
                    <ProfileTimelineItemRow key={item.id} item={item} />
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
