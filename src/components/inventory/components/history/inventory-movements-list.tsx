import { Notice } from "@/components/ui/primitives/notice";
import { SkeletonList } from "@/components/ui/primitives/skeleton-list";
import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { formatAppointmentMonthGroup } from "@/lib/format";
import type {
  InventoryItem,
  InventoryMovementWithEmployee,
} from "@/types/database.types";

import InventoryMovementRow from "./inventory-movement-row";

type InventoryMovementsListProps = {
  item: InventoryItem;
  movements: InventoryMovementWithEmployee[];
  isLoading: boolean;
  error: Error | null | undefined;
};

const headingClassName =
  "shrink-0 border-b border-border-subtle pb-4 text-lg font-medium text-ink text-wrap-balance";

function groupMovementsByMonth(movements: InventoryMovementWithEmployee[]) {
  const groups: {
    monthGroup: string;
    movements: InventoryMovementWithEmployee[];
  }[] = [];
  const indexByMonth = new Map<string, number>();

  for (const movement of movements) {
    const createdAt = movement.created_at ?? new Date().toISOString();
    const monthGroup = formatAppointmentMonthGroup(createdAt);
    const existingIndex = indexByMonth.get(monthGroup);

    if (existingIndex === undefined) {
      indexByMonth.set(monthGroup, groups.length);
      groups.push({ monthGroup, movements: [movement] });
      continue;
    }

    groups[existingIndex]!.movements.push(movement);
  }

  return groups;
}

export default function InventoryMovementsList({
  item,
  movements,
  isLoading,
  error,
}: InventoryMovementsListProps) {
  if (isLoading) {
    return (
      <section
        aria-labelledby="inventory-movements-heading"
        aria-busy="true"
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id="inventory-movements-heading" className={headingClassName}>
          {INVENTORY_ITEM_DETAIL_COPY.sections.movements}
        </h2>
        <div className="pt-6">
          <SkeletonList />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        aria-labelledby="inventory-movements-heading"
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id="inventory-movements-heading" className={headingClassName}>
          {INVENTORY_ITEM_DETAIL_COPY.sections.movements}
        </h2>
        <div className="pt-6">
          <Notice
            tone="danger"
            message={INVENTORY_ITEM_DETAIL_COPY.errors.movements}
          />
        </div>
      </section>
    );
  }

  if (movements.length === 0) {
    return (
      <section
        aria-labelledby="inventory-movements-heading"
        className="flex min-h-0 flex-1 flex-col"
      >
        <h2 id="inventory-movements-heading" className={headingClassName}>
          {INVENTORY_ITEM_DETAIL_COPY.sections.movements}
        </h2>
        <p className="py-8 text-sm text-ink-secondary">
          {INVENTORY_ITEM_DETAIL_COPY.movements.empty}
        </p>
      </section>
    );
  }

  const groups = groupMovementsByMonth(movements);

  return (
    <section
      aria-labelledby="inventory-movements-heading"
      className="flex min-h-0 flex-1 flex-col"
    >
      <h2 id="inventory-movements-heading" className={headingClassName}>
        {INVENTORY_ITEM_DETAIL_COPY.sections.movements}
      </h2>
      <div className="min-h-0 flex-1 space-y-8 pt-6">
        {groups.map((group) => (
          <div key={group.monthGroup} className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-muted">
              {group.monthGroup}
            </p>
            <ul className="relative border-l border-border-subtle pl-4">
              {group.movements.map((movement) => (
                <InventoryMovementRow
                  key={movement.id}
                  movement={movement}
                  item={item}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
