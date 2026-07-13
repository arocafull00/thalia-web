import { INVENTORY_ITEM_DETAIL_COPY } from "@/copy/inventory-item-detail-copy";
import { formatDate, formatDateTime } from "@/lib/format";
import type {
  InventoryItem,
  InventoryMovementType,
  InventoryMovementWithEmployee,
} from "@/types/database.types";

type InventoryMovementRowProps = {
  movement: InventoryMovementWithEmployee;
  item: InventoryItem;
};

function inventoryMovementTypeLabel(type: InventoryMovementType) {
  return INVENTORY_ITEM_DETAIL_COPY.movements.types[type];
}

function inventoryMovementToneClass(type: InventoryMovementType) {
  if (type === "in") {
    return "text-success";
  }

  if (type === "out") {
    return "text-danger";
  }

  return "text-warning";
}

function inventoryMovementDotClass(type: InventoryMovementType) {
  if (type === "in") {
    return "bg-success";
  }

  if (type === "out") {
    return "bg-danger";
  }

  return "bg-warning";
}

function formatMovementQuantity(
  type: InventoryMovementType,
  quantity: number,
  unit: string | null,
) {
  const unitLabel = unit ?? "un.";
  const prefix = type === "out" ? "-" : "+";

  return `${prefix}${quantity} ${unitLabel}`;
}

export default function InventoryMovementRow({
  movement,
  item,
}: InventoryMovementRowProps) {
  const createdAt = movement.created_at ?? new Date().toISOString();
  const employeeName = movement.employees?.full_name ?? "—";

  return (
    <li className="relative border-b border-border-subtle last:border-b-0">
      <div className="relative flex flex-wrap items-start justify-between gap-2 py-3">
        <span
          className={`absolute top-[18px] -left-4 size-2.5 rounded-full ${inventoryMovementDotClass(movement.type)}`}
          aria-hidden="true"
        />
        <div className="min-w-0 space-y-0.5">
          <p className="text-sm font-medium text-ink">
            {formatMovementQuantity(
              movement.type,
              movement.quantity,
              item.unit,
            )}
          </p>
          <p className="text-sm text-ink-secondary">{employeeName}</p>
          {movement.notes ? (
            <p className="text-sm text-ink-secondary">{movement.notes}</p>
          ) : null}
          <p className="text-xs text-ink-muted">
            {formatDate(createdAt)} · {formatDateTime(createdAt)}
          </p>
        </div>
        <span
          className={`text-xs uppercase tracking-wide ${inventoryMovementToneClass(movement.type)}`}
        >
          {inventoryMovementTypeLabel(movement.type)}
        </span>
      </div>
    </li>
  );
}
