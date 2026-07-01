"use client";

import { inventoryColumns } from "@/components/inventory/components/inventory-columns";
import { DataTable } from "@/components/ui/data-table";
import type { InventoryItem } from "@/types/database.types";

type InventoryTableProps = {
  items: InventoryItem[];
  emptyMessage?: string;
  onRowClick: (id: string) => void;
};

export default function InventoryTable({
  items,
  emptyMessage,
  onRowClick,
}: InventoryTableProps) {
  return (
    <DataTable
      columns={inventoryColumns}
      data={items}
      enablePagination
      enableSorting
      pageSize={10}
      emptyMessage={emptyMessage ?? "No hay materiales con ese criterio."}
      onRowClick={(item) => onRowClick(item.id)}
    />
  );
}
