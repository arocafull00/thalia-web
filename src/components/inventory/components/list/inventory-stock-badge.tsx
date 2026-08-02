import { Badge } from "@/components/ui/badge";
import {
  inventoryStockLevelLabel,
  type InventoryStockLevel,
} from "@/lib/inventory-stock";

type InventoryStockBadgeProps = {
  level: InventoryStockLevel;
};

const levelVariants: Record<
  InventoryStockLevel,
  "danger" | "warning" | "success"
> = {
  critical: "danger",
  low: "warning",
  optimal: "success",
};

export default function InventoryStockBadge({
  level,
}: InventoryStockBadgeProps) {
  return (
    <Badge variant={levelVariants[level]}>
      {inventoryStockLevelLabel(level)}
    </Badge>
  );
}
